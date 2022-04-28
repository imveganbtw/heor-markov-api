import { FindCursor, MongoClient } from "mongodb";

export interface Phrase {
  author_id: string;
  phrase: string;
  metadata: Record<string, unknown>;
}

export default class PhraseDB {
  private client: MongoClient;
  private db: string;
  private collection: string;

  constructor(db: string, collection: string, client: MongoClient) {
    this.db = db;
    this.collection = collection;
    this.client = client;
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
