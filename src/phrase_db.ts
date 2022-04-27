import { Collection, FindCursor, MongoClient } from "mongodb";
import { config as Config } from "./config";
import logger from "./logger";

export interface Phrase {
    author_id: string;
    phrase: string;
    metadata: Object;
}

class PhraseDB {
    private client: MongoClient;
    private db: string;
    private collection: string;

    constructor(db: string = "heor-markov", collection: string = "phrases", client?: MongoClient) {
        this.db = db;
        this.collection = collection;
        this.client = client ? client : new MongoClient(Config.db.connectionString);   
    }

    public async connect(): Promise<void> {
        logger.info(`Connecting to PhraseDB at ${Config.db.connectionString}`);
        try {
            await this.client.connect();
            logger.info("Connection to PhraseDB established.");
        } catch (error) {
            logger.error("Connection to PhraseDB failed", error);
        }
    }

    public async createPhrase(phrase: Phrase): Promise<string> {
        const result = await this.client.db(this.db).collection(this.collection).insertOne(phrase);
        return result.insertedId.toHexString();
    }

    public getCursor(query: Object = {}, limit = 100): FindCursor {
        return this.client.db(this.db).collection(this.collection).find().limit(limit);
    }
    
    public async getDocumentCount(): Promise<number> {
        return await this.client.db(this.db).collection(this.collection).estimatedDocumentCount();
    }
}

const phraseDB = new PhraseDB();
phraseDB.connect();
export default phraseDB;