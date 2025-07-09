import express from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db/notes'
import logger from '../utils/logger'

const router = express.Router()

router.get('/notes', async (req, res) => {
  logger.info('Fetching all notes')
  await db.read()
  res.json(db.data!.notes)
})

router.post('/notes', async (req, res) => {
  const { title, content } = req.body
  const newNote = {
    id: uuid(),
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  db.data!.notes.push(newNote)
  await db.write()
  logger.info({ body: req.body }, 'New note created')
  res.status(201).json(newNote)
})

router.get('/notes/:id', async (req, res) => {
  const note = db.data!.notes.find((n) => n.id === req.params.id)
  if (!note) {
    return res.status(404).json({ error: 'Note not found' })
  }
  res.json(note)
})

router.put('/notes/:id', async (req, res) => {
  const noteIndex = db.data!.notes.findIndex((n) => n.id === req.params.id)
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' })
  }

  const updatedNote = {
    ...db.data!.notes[noteIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  }

  db.data!.notes[noteIndex] = updatedNote
  await db.write()
  res.json(updatedNote)
})

router.delete('/notes/:id', async (req, res) => {
  const noteIndex = db.data!.notes.findIndex((n) => n.id === req.params.id)
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' })
  }

  db.data!.notes.splice(noteIndex, 1)
  await db.write()
  res.status(204).send()
})

export default router
