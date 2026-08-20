import { kv } from './_kv.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const checks = {
    kv_url:   !!(process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL),
    kv_token: !!(process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN),
    kv_ping:  false,
    leads_count: null,
    error: null,
  }

  try {
    await kv.ping()
    checks.kv_ping = true
    const leads = (await kv.get('surligneur_leads')) || []
    checks.leads_count = leads.length
  } catch (err) {
    checks.error = err.message
  }

  const ok = checks.kv_ping
  return res.status(ok ? 200 : 503).json(checks)
}
