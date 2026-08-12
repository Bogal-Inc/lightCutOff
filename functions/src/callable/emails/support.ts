import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

// Envoi via Brevo (domaine njuka.app authentifié — DKIM/DMARC stricts p=reject :
// l'expéditeur DOIT être @njuka.app, jamais l'adresse du visiteur, qui passe en
// reply-to). Le secret BREVO_API_KEY vit dans Secret Manager (posé par le repo app).
const brevoApiKey = defineSecret('BREVO_API_KEY');

const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'
  }[c] as string));

export const contactus = onRequest(
  { cors: true, secrets: [brevoApiKey] },
  async (req, res) => {
    const email = String(req.body?.email ?? '').trim();
    const subject = String(req.body?.subject ?? '').trim();
    const body = String(req.body?.body ?? '').trim();

    if (!email || !body || email.length > 254 || subject.length > 200 || body.length > 5000) {
      res.status(400).send('Bad Request');
      return;
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey.value(),
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'NJUKA — formulaire de contact', email: 'noreply@njuka.app' },
        to: [{ email: 'support@njuka.app', name: 'Support NJUKA' }],
        replyTo: { email },
        subject: subject ? `[Contact site] ${subject}` : '[Contact site] Message via njuka.app',
        htmlContent:
          `<p>Message envoyé depuis le formulaire de contact de njuka.app par <b>${escapeHtml(email)}</b> :</p>` +
          `<blockquote style="white-space:pre-wrap">${escapeHtml(body)}</blockquote>` +
          '<p style="color:#888">Répondre à cet email répondra directement au visiteur (reply-to).</p>'
      })
    });

    if (!response.ok) {
      console.error('Brevo send failed', response.status, await response.text());
      res.status(502).send('Send failed');
      return;
    }
    // le client (contact-us.component) teste la chaîne exacte 'Sended'
    res.send('Sended');
  }
);
