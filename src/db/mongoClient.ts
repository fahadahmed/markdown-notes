import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db: Db | undefined;
export async function connectToDB(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db('markdownNotesDB');
  }
  return db;
}

process.on('SIGINT', async () => {
  if (db) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});