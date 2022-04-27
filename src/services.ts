import { MongoClient } from "mongodb";
import PhraseDB from "./phrase_db";
import Markov from "./markov";
import Config from "./config";
// MongoDB Client
export const mongoClient = new MongoClient(Config.db.connectionString);

// Phrase DB
export const phraseDb = new PhraseDB(
  Config.markov.db_name,
  Config.markov.collection_name,
  mongoClient
);
phraseDb.connect();

// Markov Client
export const markov = new Markov(phraseDb);
