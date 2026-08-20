import { kv } from '../_kv.js'

const LIST_KEY = 'surligneur_leads'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // ── DELETE : supprime un lead par id ───────────────────
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      const leads = (await kv.get(LIST_KEY)) || []
      const filtered = leads.filter(l => l.id !== id)
      // Supprime des deux emplacements
      await Promise.all([
        kv.set(LIST_KEY, filtered),
        kv.del(`lead_${id}`),
      ])
      console.log(`🗑️  Lead supprimé : ${id}`)
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('❌ KV DELETE error:', err.message)
      return res.status(503).json({ error: 'kv_unavailable', message: err.message })
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}
