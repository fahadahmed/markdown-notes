import { connectToDB } from "../db/mongoClient.ts"
import { ObjectId } from "mongodb"
import { Note } from "../models/notes.ts"


export async function getAllNotes(): Promise<Note[]> {
  const db = await connectToDB()
  const notesCollection = db.collection<Note>('notes')
  return notesCollection.find().toArray()
}

export async function getNoteById(id: string): Promise<Note | null> {
  const db = await connectToDB()
  return db.collection<Note>('notes').findOne({ _id: new ObjectId(id) })
}

export async function addNote(note: Omit<Note, '_id'>): Promise<Note> {
  const db = await connectToDB()
  const notesCollection = db.collection<Note>('notes')
  const result = await notesCollection.insertOne(note)
  return { ...note, id: result.insertedId.toString() }
}

export async function updateNote(id: string, note: Partial<Omit<Note, "id">>): Promise<Note | null> {
  const db = await connectToDB()
  const notesCollection = db.collection<Note>('notes')
  const result = await notesCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: note },
    { returnDocument: "after" }
  )
  return result
}

export async function deleteNote(id: string): Promise<void> {
  const db = await connectToDB()
  const notesCollection = db.collection<Note>('notes')
  await notesCollection.deleteOne({ _id: new ObjectId(id) })
}
