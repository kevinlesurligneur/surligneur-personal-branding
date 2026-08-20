import { kv } from '@vercel/kv'

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
      return res.status(201).json(lead)
    } catch (err) {
      console.error('❌ KV POST error:', err.message)
      return res.status(503).json({ error: 'kv_unavailable', message: err.message })
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}
