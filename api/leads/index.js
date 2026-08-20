import { kv } from '../_kv.js'
import { getProfile, ARCHETYPES } from '../../src/data/profiles.js'

const PROD_URL = 'https://surligneur-personal-branding.vercel.app'

function genderKey(gender) {
  return gender === 'femme' ? 'feminine' : 'masculine'
}

function buildEmailHtml(lead, profile, archetype) {
  const scores = lead.scores || { E: 0, G: 0, L: 0, X: 0 }
  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  const pct = (k) => (total > 0 ? Math.round((scores[k] / total) * 100) : 0)

  const resultsUrl = `${PROD_URL}/resultats?profile=${encodeURIComponent(lead.profile)}&E=${scores.E}&G=${scores.G}&L=${scores.L}&X=${scores.X}&g=${encodeURIComponent(lead.gender || 'homme')}`
  const quizUrl = `${PROD_URL}/test`

  const color = archetype.color
  const bgDark = archetype.colorBg
  const textColor = archetype.textColor
  const borderColor = archetype.borderColor

  const keywords = (profile.keywords || [])
    .map(kw => `<span style="display:inline-block;background:rgba(255,255,255,0.07);color:${textColor};border:1px solid ${borderColor};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;margin:3px 3px 3px 0;">${kw}</span>`)
    .join('')

  const scoreRows = [
    { k: 'E', label: 'Expert', c: ARCHETYPES.expert.color, tc: ARCHETYPES.expert.textColor },
    { k: 'G', label: 'Grande Gueule', c: ARCHETYPES['grande-gueule'].color, tc: ARCHETYPES['grande-gueule'].textColor },
    { k: 'L', label: 'Leader', c: ARCHETYPES.leader.color, tc: ARCHETYPES.leader.textColor },
    { k: 'X', label: 'Explorateur', c: ARCHETYPES.explorateur.color, tc: ARCHETYPES.explorateur.textColor },
  ].map(({ k, label, c, tc }) => {
    const p = pct(k)
    return `
      <tr>
        <td style="padding:5px 0;font-size:12px;color:rgba(255,255,255,0.45);width:100px;">${label}</td>
        <td style="padding:5px 8px;">
          <div style="background:rgba(255,255,255,0.06);border-radius:4px;height:6px;overflow:hidden;">
            <div style="width:${p}%;height:100%;background:${c};border-radius:4px;"></div>
          </div>
        </td>
        <td style="padding:5px 0;font-size:12px;font-weight:700;color:${tc};width:36px;text-align:right;">${p}%</td>
      </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Ton profil Personal Branding — ${profile.name}</title>
</head>
<body style="margin:0;padding:0;background:#0D0F1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:24px 16px 40px;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0D1224 0%,#071e3d 100%);border-radius:16px 16px 0 0;padding:28px 36px;text-align:center;border-bottom:1px solid rgba(0,212,245,0.15);">
    <p style="margin:0 0 6px;color:#00D4F5;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;">LE SURLIGNEUR</p>
    <h1 style="margin:0 0 6px;color:white;font-size:22px;font-weight:700;letter-spacing:-0.02em;">Test de Personal Branding</h1>
    <p style="margin:0;color:rgba(255,255,255,0.35);font-size:13px;">Méthodologie exclusive · Le Crayon Groupe</p>
  </div>

  <!-- Body -->
  <div style="background:#111827;padding:32px 36px;">
    <p style="margin:0 0 6px;color:rgba(255,255,255,0.9);font-size:17px;font-weight:600;">Bonjour ${lead.firstName} ! 👋</p>
    <p style="margin:0 0 28px;color:rgba(255,255,255,0.45);font-size:14px;line-height:1.6;">Voici ton profil Personal Branding. Garde-le précieusement — il va t'aider à définir ta stratégie de contenu.</p>

    <!-- Profile card -->
    <div style="background:${bgDark};border:1px solid ${borderColor};border-radius:14px;padding:24px;margin-bottom:24px;">
      <div style="margin-bottom:16px;">
        <span style="font-size:38px;line-height:1;">${profile.emoji}</span>
        <p style="margin:8px 0 2px;color:${color};font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">${archetype.labelShort || archetype.label}</p>
        <h2 style="margin:0;color:white;font-size:24px;font-weight:800;letter-spacing:-0.02em;">${profile.name}</h2>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.4);font-size:13px;font-style:italic;">${profile.tagline}</p>
      </div>

      <div style="border-left:3px solid ${color};padding-left:14px;margin-bottom:18px;">
        <p style="margin:0;color:rgba(255,255,255,0.75);font-size:13px;font-style:italic;line-height:1.6;">«&nbsp;${profile.quote}&nbsp;»</p>
      </div>

      <p style="margin:0 0 18px;color:rgba(255,255,255,0.7);font-size:14px;line-height:1.7;">${profile.description}</p>

      <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px;margin-bottom:10px;">
        <p style="margin:0 0 5px;color:${color};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">🚀 Ton superpouvoir</p>
        <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;line-height:1.6;">${profile.superpower}</p>
      </div>

      <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px;margin-bottom:14px;">
        <p style="margin:0 0 5px;color:${color};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✍️ Ton style de contenu</p>
        <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;line-height:1.6;">${profile.contentStyle}</p>
      </div>

      <div>${keywords}</div>
    </div>

    <!-- Score mini-chart -->
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0 0 12px;color:rgba(255,255,255,0.5);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📊 Répartition de tes points</p>
      <table style="width:100%;border-collapse:collapse;">${scoreRows}</table>
    </div>

    <!-- CTA principal -->
    <div style="text-align:center;margin-bottom:16px;">
      <a href="${resultsUrl}" style="display:inline-block;background:linear-gradient(135deg,#00D4F5,#0066CC);color:white;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;letter-spacing:-0.01em;">
        Voir mon profil complet &amp; télécharger →
      </a>
    </div>

    <div style="text-align:center;margin-bottom:8px;">
      <a href="${quizUrl}" style="color:#00D4F5;text-decoration:none;font-size:13px;font-weight:600;">
        Refaire le test ou découvrir les 12 profils →
      </a>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:#0D1224;border-radius:0 0 16px 16px;border-top:1px solid rgba(255,255,255,0.05);padding:20px 36px;text-align:center;">
    <p style="margin:0 0 6px;color:rgba(255,255,255,0.35);font-size:12px;">Une question ? Je suis là.</p>
    <a href="mailto:kevinchalambert@gmail.com" style="color:#00D4F5;text-decoration:none;font-size:13px;font-weight:600;">kevinchalambert@gmail.com</a>
    <br/><br/>
    <a href="https://www.lecrayongroupe.fr/le-surligneur" style="color:rgba(255,255,255,0.25);text-decoration:none;font-size:11px;">lecrayongroupe.fr/le-surligneur</a>
  </div>

</div>
</body>
</html>`
}

async function sendResultEmail(lead) {
  const RESEND_KEY = process.env.RESEND_API_KEY
  if (!RESEND_KEY) return

  const gender = genderKey(lead.gender)
  const profile = getProfile(lead.profile, gender)
  if (!profile) return

  const archetype = ARCHETYPES[profile.major]
  const html = buildEmailHtml(lead, profile, archetype)

  const from = process.env.RESEND_FROM_EMAIL || 'Le Surligneur <onboarding@resend.dev>'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [lead.email],
      subject: `${profile.emoji} Ton profil Personal Branding : ${profile.name}`,
      html,
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || JSON.stringify(data))
  console.log(`📧 Email envoyé à ${lead.email} (Resend ID: ${data.id})`)
}

const LIST_KEY = 'surligneur_leads'

/** Reconstruit la liste principale depuis les clés individuelles si besoin */
async function rebuildIfEmpty(current) {
  if (current.length > 0) return current
  const keys = await kv.keys('lead_*')
  if (!keys.length) return []
  const items = await Promise.all(keys.map(k => kv.get(k)))
  const rebuilt = items
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date))
  if (rebuilt.length > 0) {
    await kv.set(LIST_KEY, rebuilt)
    console.log(`🔄 Liste reconstruite depuis ${rebuilt.length} clés individuelles`)
  }
  return rebuilt
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // ── GET : liste tous les leads ─────────────────────────
  if (req.method === 'GET') {
    try {
      const raw = (await kv.get(LIST_KEY)) || []
      const leads = await rebuildIfEmpty(raw)
      return res.status(200).json(leads)
    } catch (err) {
      console.error('❌ KV GET error:', err.message)
      return res.status(503).json({ error: 'kv_unavailable', message: err.message })
    }
  }

  // ── POST : enregistre un nouveau lead ──────────────────
  if (req.method === 'POST') {
    try {
      const raw = (await kv.get(LIST_KEY)) || []
      const leads = await rebuildIfEmpty(raw)
      const lead = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        date: new Date().toISOString(),
        ...req.body,
      }
      leads.push(lead)
      // Double écriture : liste principale + clé individuelle (filet de sécurité)
      await Promise.all([
        kv.set(LIST_KEY, leads),
        kv.set(`lead_${lead.id}`, lead),
      ])
      console.log(`📥 Nouveau lead : ${lead.firstName} ${lead.lastName} (${lead.email})`)

      // Email automatique via Resend (fire-and-forget)
      sendResultEmail(lead).catch(err => console.error('Email error:', err.message))

      return res.status(201).json(lead)
    } catch (err) {
      console.error('❌ KV POST error:', err.message)
      return res.status(503).json({ error: 'kv_unavailable', message: err.message })
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}
