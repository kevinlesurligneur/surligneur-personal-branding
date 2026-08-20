import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // ── GET : liste tous les leads ─────────────────────────
  if (req.method === 'GET') {
    try {
      const leads = (await kv.get('surligneur_leads')) || []
      return res.status(200).json(leads)
    } catch (err) {
      console.error('❌ KV GET error:', err.message)
      return res.status(503).json({
        error: 'kv_unavailable',
        message: err.message,
      })
    }
  }

  // ── POST : enregistre un nouveau lead ──────────────────
  if (req.method === 'POST') {
    try {
      const leads = (await kv.get('surligneur_leads')) || []
      const lead = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        date: new Date().toISOString(),
        ...req.body,
      }
      leads.push(lead)
      await kv.set('surligneur_leads', leads)
      console.log(`📥 Nouveau lead : ${lead.firstName} ${lead.lastName} (${lead.email})`)
      return res.status(201).json(lead)
    } catch (err) {
      console.error('❌ KV POST error:', err.message)
      return res.status(503).json({
        error: 'kv_unavailable',
        message: err.message,
      })
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}
