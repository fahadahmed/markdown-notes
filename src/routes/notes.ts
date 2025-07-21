import express from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db/notes.js'
import { getAllNotes, getNoteById, addNote, updateNote, deleteNote } from '../services/notesService.ts'
import logger from '../utils/logger.js'

const router = express.Router()

router.get('/notes', async (req, res) => {
  logger.info('Fetching all notes')
  try {
    const notes = await getAllNotes()
    res.json(notes)
  } catch (error) {
    logger.error('Error fetching notes', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
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

  try {
    const note = await addNote(newNote)
    logger.info({ body: req.body }, 'New note created')
    res.status(201).json(note)
  } catch (error) {
    logger.error('Error creating note', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.get('/notes/:id', async (req, res) => {
  try {
    const note = await getNoteById(req.params.id)
    if (!note) {
      logger.warn(`Note with id ${req.params.id} not found`)
      return res.status(404).json({ error: 'Note not found' })
    }
    logger.info(`Fetched note with id ${req.params.id}`)
    res.json(note)
  } catch (error) {
    logger.error('Error fetching note', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.put('/notes/:id', async (req, res) => {
  const { title, content } = req.body
  const updatedNote = {
    title,
    content,
    updatedAt: new Date().toISOString(),
  }

  try {
    const note = await updateNote(req.params.id, updatedNote)
    if (!note) {
      logger.warn(`Note with id ${req.params.id} not found for update`)
      return res.status(404).json({ error: 'Note not found' })
    }
    logger.info({ body: req.body }, `Note with id ${req.params.id} updated`)
    res.json(note)
  } catch (error) {
    logger.error('Error updating note', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.delete('/notes/:id', async (req, res) => {
  try {
    await deleteNote(req.params.id)
    logger.info(`Note with id ${req.params.id} deleted`)
    res.status(204).send()
  } catch (error) {
    logger.error('Error deleting note', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default router
