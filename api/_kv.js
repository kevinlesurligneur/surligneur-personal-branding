import { createClient } from '@vercel/kv'

const url   = process.env.STORAGE_KV_REST_API_URL   || process.env.KV_REST_API_URL
const token = process.env.STORAGE_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN

if (!url || !token) {
  console.warn('⚠️  KV env vars manquants (KV_REST_API_URL / STORAGE_KV_REST_API_URL)')
}

export const kv = createClient({ url, token })
