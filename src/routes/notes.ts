import express from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db/notes.js'
import logger from '../utils/logger.js'

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
  const note = db.data!.notes.find((n: any) => n.id === req.params.id)
  if (!note) {
    logger.warn(`Note with id ${req.params.id} not found`)
    return res.status(404).json({ error: 'Note not found' })
  }
  logger.info(`Fetched note with id ${req.params.id}`)
  res.json(note)
})

router.put('/notes/:id', async (req, res) => {
  const noteIndex = db.data!.notes.findIndex((n: any) => n.id === req.params.id)
  if (noteIndex === -1) {
    logger.warn(`Note with id ${req.params.id} not found for update`)
    return res.status(404).json({ error: 'Note not found' })
  }

  const updatedNote = {
    ...db.data!.notes[noteIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  }

  db.data!.notes[noteIndex] = updatedNote
  await db.write()
  logger.info({ body: req.body }, `Note with id ${req.params.id} updated`)
  res.json(updatedNote)
})

router.delete('/notes/:id', async (req, res) => {
  const noteIndex = db.data!.notes.findIndex((n: any) => n.id === req.params.id)
  if (noteIndex === -1) {
    logger.error(`Note with id ${req.params.id} not found for deletion`)
    return res.status(404).json({ error: 'Note not found' })
  }

  db.data!.notes.splice(noteIndex, 1)
  await db.write()
  logger.info(`Note with id ${req.params.id} deleted`)
  res.status(204).send()
})

export default router
