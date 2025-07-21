import express from 'express'
import request from 'supertest'
import { describe, it, beforeEach, vi, expect } from 'vitest'
import notesRouter from './notes.ts'
import db from '../db/notes.ts'

// Mock dependencies
vi.mock('../db/notes', () => ({
  default: {
    data: { notes: [] },
    read: vi.fn(),
    write: vi.fn(),
  },
}))
vi.mock('../utils/logger', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))
vi.mock('uuid', () => ({
  v4: () => 'test-uuid',
}))

const app = express()
app.use(express.json())
app.use(notesRouter)

describe('Notes API', () => {
  beforeEach(() => {
    db.data.notes = [{ id: '1', title: 'Test Note', content: 'This is a test note', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]
    vi.mocked(db.read).mockResolvedValue()
    vi.mocked(db.write).mockResolvedValue()
  })

  it('GET /notes returns all notes', async () => {
    const res = await request(app).get('/notes')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].id).toBe('1')
  })

  it('POST /notes creates a new note', async () => {
    const newNote = { title: 'New', content: 'New content' }
    const res = await request(app).post('/notes').send(newNote)
    expect(res.status).toBe(201)
    expect(res.body.title).toBe('New')
    expect(res.body.content).toBe('New content')
    expect(res.body.id).toBe('test-uuid')
    expect(db.data.notes.length).toBe(2)
  })

  it('GET /notes/:id returns a note by id', async () => {
    const res = await request(app).get('/notes/1')
    expect(res.status).toBe(200)
    expect(res.body.id).toBe('1')
  })

  it('GET /notes/:id returns 404 if not found', async () => {
    const res = await request(app).get('/notes/unknown')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Note not found')
  })

  it('PUT /notes/:id updates a note', async () => {
    const res = await request(app)
      .put('/notes/1')
      .send({ title: 'Updated', content: 'Updated content' })
    expect(res.status).toBe(200)
    expect(res.body.title).toBe('Updated')
    expect(res.body.content).toBe('Updated content')
    expect(res.body.updatedAt).toBeDefined()
  })

  it('PUT /notes/:id returns 404 if not found', async () => {
    const res = await request(app)
      .put('/notes/unknown')
      .send({ title: 'Updated' })
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Note not found')
  })

  it('DELETE /notes/:id deletes a note', async () => {
    const res = await request(app).delete('/notes/1')
    expect(res.status).toBe(204)
    expect(db.data.notes.length).toBe(0)
  })

  it('DELETE /notes/:id returns 404 if not found', async () => {
    const res = await request(app).delete('/notes/unknown')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Note not found')
  })
})

// We recommend installing an extension to run vitest tests.
