import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const LEADS_FILE = join(DATA_DIR, 'leads.json')

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR)
if (!existsSync(LEADS_FILE)) writeFileSync(LEADS_FILE, '[]', 'utf8')

function readLeads() {
  try { return JSON.parse(readFileSync(LEADS_FILE, 'utf8')) }
  catch { return [] }
}

function writeLeads(leads) {
  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8')
}

const app = express()
app.use(cors())
app.use(express.json())

// ── GET all leads ──────────────────────────────────────────
app.get('/api/leads', (req, res) => {
  res.json(readLeads())
})

// ── POST new lead ──────────────────────────────────────────
app.post('/api/leads', (req, res) => {
  const leads = readLeads()
  const lead = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    ...req.body,
  }
  leads.push(lead)
  writeLeads(leads)
  console.log(`📥 Nouveau lead : ${lead.firstName} ${lead.lastName} (${lead.email})`)
  res.status(201).json(lead)
})

// ── DELETE lead by id ──────────────────────────────────────
app.delete('/api/leads/:id', (req, res) => {
  const leads = readLeads()
  const before = leads.length
  const filtered = leads.filter(l => l.id !== req.params.id)
  writeLeads(filtered)
  console.log(`🗑️  Lead supprimé (${before - filtered.length} entrée)`)
  res.json({ ok: true })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`✅  API Surligneur → http://localhost:${PORT}/api/leads`)
})
