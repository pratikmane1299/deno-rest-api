import { MongoClient } from 'https://deno.land/x/mongo@v0.8.0/mod.ts';
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();
const client = new MongoClient();
client.connectWithUri(env.MONGO_DB_URI);

const db = client.database(env.MONGO_DB_NAME);
const posts = db.collection("posts");

export { db, posts }