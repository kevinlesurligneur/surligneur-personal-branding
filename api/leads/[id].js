import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // ── DELETE : supprime un lead par id ───────────────────
  if (req.method === 'DELETE') {
    const { id } = req.query
    const leads = (await kv.get('surligneur_leads')) || []
    const filtered = leads.filter(l => l.id !== id)
    await kv.set('surligneur_leads', filtered)
    console.log(`🗑️  Lead supprimé : ${id}`)
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}
