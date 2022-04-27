import { FindCursor, MongoClient } from "mongodb";
import { config } from "./config";
import logger from "./logger";

export interface Phrase {
  author_id: string;
  phrase: string;
  metadata: Record<string, unknown>;
}

class PhraseDB {
  private client: MongoClient;

  private db: string;

  private collection: string;

  constructor(db: string, collection: string, client?: MongoClient) {
    this.db = db;
    this.collection = collection;
    this.client = client || new MongoClient(config.db.connectionString);
  }

  public async connect(): Promise<void> {
    logger.info(`Connecting to PhraseDB at ${config.db.connectionString}`);
    try {
      await this.client.connect();
      logger.info("Connection to PhraseDB established.");
    } catch (error) {
      logger.error("Connection to PhraseDB failed", error);
    }
  }

  public async createPhrase(phrase: Phrase): Promise<string> {
    const result = await this.client
      .db(this.db)
      .collection(this.collection)
      .insertOne(phrase);
    return result.insertedId.toHexString();
  }

  public getCursor(
    query: Record<string, unknown> = {},
    limit = 100
  ): FindCursor {
    return this.client
      .db(this.db)
      .collection(this.collection)
      .find(query)
      .limit(limit);
  }

  public async getDocumentCount(): Promise<number> {
    return this.client
      .db(this.db)
      .collection(this.collection)
      .estimatedDocumentCount();
  }
}

const phraseDB = new PhraseDB(
  config.markov.db_name,
  config.markov.collection_name
);
phraseDB.connect();
export default phraseDB;
