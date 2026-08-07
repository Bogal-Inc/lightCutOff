import { onRequest } from 'firebase-functions/v2/https';
import * as nodemailer from 'nodemailer';

// Identifiants lus depuis l'environnement (.env / secrets),
// remplace l'ancien functions.config() supprimé par Firebase.
function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });
}

export const contactus = onRequest({ cors: true }, (req, res) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const body = req.body.body;

  const mailOptions = {
    from: `Support <${email}>`,
    to: 'support@njuka.app',
    subject: subject,
    html: `<p>Vous avez été contacté par ${email}</p>
    <p>
    Son message est:
    <blockquote style='white-space:pre'>${body}</blockquote>
    </p>
    `
  };

  getTransporter().sendMail(mailOptions, (erro) => {
    if (erro) {
      res.send(erro.toString());
      return;
    }
    res.send('Sended');
  });
});
