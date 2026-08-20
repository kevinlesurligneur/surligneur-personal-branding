import { kv } from './_kv.js'

/**
 * Cron Vercel — déclenché quotidiennement (voir vercel.json).
 * Effectue un ping + une écriture/lecture sur la clé keep-alive pour
 * éviter l'archivage automatique Upstash après inactivité.
 */
export default async function handler(req, res) {
  // Sécurité minimale : Vercel envoie un header CRON_SECRET
  const secret = req.headers['authorization']
  if (process.env.CRON_SECRET && secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  try {
    await kv.ping()
    await kv.set('keepalive_last_ping', new Date().toISOString())
    const leads = (await kv.get('surligneur_leads')) || []
    console.log(`✅ Keep-alive OK — ${leads.length} leads en base — ${new Date().toISOString()}`)
    return res.status(200).json({ ok: true, leads_count: leads.length, ts: new Date().toISOString() })
  } catch (err) {
    console.error('❌ Keep-alive KV error:', err.message)
    return res.status(503).json({ ok: false, error: err.message })
  }
}
