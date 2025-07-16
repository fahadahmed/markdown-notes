import express from 'express'
import notesRouter from './routes/notes.ts'

const app = express()
app.get('/', (req, res) => {
  res.send('Welcome to the Markdown Notes API')
})

app.use(express.json())
app.use('/api', notesRouter)

export default app
