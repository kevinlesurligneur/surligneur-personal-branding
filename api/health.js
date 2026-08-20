import { kv } from './_kv.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const url   = process.env.STORAGE_KV_REST_API_URL || process.env.KV_REST_API_URL || ''
  const token = process.env.STORAGE_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN || ''
  const checks = {
    kv_url:          !!(url),
    kv_token:        !!(token),
    url_preview:     url.slice(0, 45),
    storage_url_set: !!process.env.STORAGE_KV_REST_API_URL,
    kv_url_set:      !!process.env.KV_REST_API_URL,
    kv_ping:         false,
    leads_count:     null,
    error:           null,
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
