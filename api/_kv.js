const BASE_URL = (
  process.env.STORAGE_KV_REST_API_URL ||
  process.env.KV_REST_API_URL ||
  'https://set-octopus-169508.upstash.io'
).replace(/\/$/, '')

const TOKEN =
  process.env.STORAGE_KV_REST_API_TOKEN ||
  process.env.KV_REST_API_TOKEN ||
  'gQAAAAAAApYkAAIgcDJjYjc2MDI5ZWYyYjg0NGNhYTQwMDMwMDZiZTk3NTY0MA'

async function cmd(...args) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  })
  if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result
}

export const kv = {
  ping: () => cmd('PING'),

  get: async (key) => {
    const result = await cmd('GET', key)
    if (result === null) return null
    try { return JSON.parse(result) } catch { return result }
  },

  set: (key, value) => cmd('SET', key, JSON.stringify(value)),

  del: (key) => cmd('DEL', key),

  keys: (pattern) => cmd('KEYS', pattern),
}
