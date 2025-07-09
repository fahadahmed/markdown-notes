import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { Data } from '../models/notes.js'

const adapter = new JSONFile<Data>('db.json')
const db = new Low<Data>(adapter, { notes: [] })

await db.read()
db.data ||= { notes: [] }

export default db
