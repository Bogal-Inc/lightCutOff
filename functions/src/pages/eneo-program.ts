import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

/**
 * Page SEO server-rendered : « Programme des coupures SOCADEL (ex-Eneo) »
 * (/programme-coupures-socadel ; l'ancienne URL /programme-coupures-eneo redirige en 301).
 * Cible la recherche Google quotidienne « programme coupure SOCADEL/Eneo <ville> » — la
 * SPA ne peut pas la capter (contenu client). Même donnée que l'onglet Programmées du
 * site et le segment de l'app : `official_outages` (ingestion quotidienne par la CF de
 * l'app — noms techniques `eneo`/ingestEneoOutages inchangés : contrat de données).
 * Servie via un rewrite hosting (firebase.json), cache CDN 30 min.
 * L'opérateur électricité s'appelle SOCADEL depuis la reprise d'Eneo — la mention
 * « ex-Eneo » reste volontairement (les recherches Google utilisent encore l'ancien nom).
 */

interface OutageRow {
  region: string;
  ville: string;
  quartier: string;
  reason: string;
  progDate: string;
  startTime: string;
  endTime: string;
}

const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'
  }[c] as string));

const todayYmd = (): string => {
  // date du jour côté Cameroun (fuseau de la donnée Eneo)
  const now = new Date(Date.now() + 60 * 60 * 1000); // UTC+1 Africa/Douala
  return now.toISOString().slice(0, 10);
};

const formatDate = (ymd: string): string => {
  const date = new Date(`${ymd}T00:00:00`);
  if (isNaN(date.getTime())) {
    return ymd;
  }
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'
  }).format(date);
};

function renderRows(outages: OutageRow[]): string {
  if (outages.length === 0) {
    return '<p class="empty">Aucune coupure programmée annoncée pour les prochains jours.</p>';
  }
  const byDate = new Map<string, OutageRow[]>();
  for (const outage of outages) {
    const list = byDate.get(outage.progDate) ?? [];
    list.push(outage);
    byDate.set(outage.progDate, list);
  }
  let html = '';
  for (const [date, list] of byDate) {
    html += `<h2>${escapeHtml(formatDate(date))}</h2><ul>`;
    for (const o of list) {
      html += '<li><b>' + escapeHtml(o.ville) + '</b>' +
        (o.quartier ? ' — ' + escapeHtml(o.quartier) : '') +
        ` <span class="window">${escapeHtml(o.startTime)}–${escapeHtml(o.endTime)}</span>` +
        (o.region ? ` <span class="region">(${escapeHtml(o.region)})</span>` : '') +
        (o.reason ? `<br><small>${escapeHtml(o.reason)}</small>` : '') +
        '</li>';
    }
    html += '</ul>';
  }
  return html;
}

export const renderEneoProgram = onRequest(async (req, res) => {
  const snap = await admin.firestore()
    .collection('official_outages')
    .where('country', '==', 'CM')
    .get();

  const today = todayYmd();
  const outages: OutageRow[] = snap.docs
    .map((doc) => doc.data() as OutageRow)
    .filter((o) => (o.progDate ?? '') >= today)
    .sort((a, b) => (a.progDate + a.startTime).localeCompare(b.progDate + b.startTime));

  const updated = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Douala'
  }).format(new Date());

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Programme des coupures SOCADEL (ex-Eneo) — délestages annoncés au Cameroun | NJUKA</title>
<meta name="description" content="Le programme officiel des coupures d'électricité SOCADEL (ex-Eneo) des prochains jours, par ville et quartier (Yaoundé, Douala…), mis à jour chaque jour. Suivez aussi les coupures en temps réel avec l'application NJUKA.">
<link rel="canonical" href="https://njuka.app/programme-coupures-socadel">
<link rel="icon" type="image/png" href="/assets/static/images/njuka/njuka_icon.png">
<meta name="apple-itunes-app" content="app-id=6794127922">
<style>
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1A1A1A;background:#f7f7f5}
  header{background:#1A1A1A;padding:14px 20px}
  header a{color:#fff;font-weight:800;letter-spacing:.25em;text-decoration:none}
  main{max-width:760px;margin:0 auto;padding:24px 20px 48px}
  h1{font-size:1.5rem}
  h2{font-size:1.1rem;margin-top:28px;border-left:4px solid #F88E01;padding-left:10px;text-transform:capitalize}
  ul{list-style:none;padding:0}
  li{background:#fff;border-radius:8px;padding:10px 14px;margin-bottom:8px;border-left:4px solid #F88E01;box-shadow:0 2px 8px rgba(26,26,26,.06)}
  .window{font-weight:700}
  .region,small,.updated{color:#777}
  .empty{background:#fff;border-radius:8px;padding:16px;text-align:center;color:#777}
  .cta{margin-top:32px;background:#1A1A1A;color:#fff;border-radius:12px;padding:20px}
  .cta a.btn{display:inline-block;margin-top:10px;background:#F88E01;color:#1A1A1A;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none}
  .links{margin-top:16px}
  .links a{color:#1A1A1A}
</style>
</head>
<body>
<header><a href="/">NJUKA</a></header>
<main>
  <h1>Programme des coupures SOCADEL (ex-Eneo) — délestages annoncés</h1>
  <p>Les coupures d'électricité <b>programmées par SOCADEL</b> (l'opérateur national, ex-Eneo)
  pour les prochains jours au Cameroun, par ville et quartier. Données publiées par
  l'opérateur, réactualisées chaque jour.
  <span class="updated">Dernière mise à jour : ${escapeHtml(updated)}.</span></p>
  ${renderRows(outages)}
  <div class="cta">
    <b>Et les coupures non annoncées ?</b><br>
    La plupart des coupures ne sont jamais annoncées. Avec l'application NJUKA, vous voyez les
    coupures d'électricité et d'eau signalées en temps réel autour de vous — et vous êtes
    alerté quand le courant revient.
    <br><a class="btn" href="https://njuka.app/map?utm_source=seo_socadel">Voir la carte des coupures</a>
  </div>
  <p class="links"><a href="/">njuka.app</a> · <a href="/map">Carte en temps réel</a> · <a href="/faq">FAQ</a></p>
</main>
</body>
</html>`;

  res.set('Cache-Control', 'public, max-age=600, s-maxage=1800');
  res.status(200).send(html);
});
