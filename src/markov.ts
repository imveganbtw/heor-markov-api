import MarkovChain from "purpl-markov-chain";
import { performance } from "perf_hooks";
import PhraseDB, { Phrase } from "./phrase_db";
import logger from "./logger";

export interface GenerationConfig {
  from: string;
  grams: number;
  backward: boolean;
}

export default class Markov {
  private db: PhraseDB;
  private chain: MarkovChain = new MarkovChain();

  constructor(db: PhraseDB) {
    this.db = db;
  }

  public async getCorpusSize(): Promise<number> {
    return this.db.getDocumentCount();
  }

  public async loadCorpus(limit = 1000000): Promise<void> {
    const corpusSize = Math.min(limit, await this.db.getDocumentCount());
    const batchSize = (Math.round(corpusSize / 1000) * 1000) / 10;
    const cursor = this.db.getCursor({}, corpusSize);

    logger.info(
      `Starting corpus load from Phrase DB. Estimated size: ${corpusSize} documents`
    );
    const start = performance.now();
    let count = 0;
    await cursor.forEach(
      (document: {
        author_id: string;
        phrase: string;
        metadata: Record<string, unknown>;
      }) => {
        const phrase: Phrase = {
          author_id: document.author_id,
          phrase: document.phrase,
          metadata: document.metadata || {},
        };
        if (phrase.phrase) {
          count += 1;

          this.chain.update(phrase.phrase);
          if (count % batchSize === 0) {
            logger.info(`...Loaded ${count} of ${corpusSize}`);
          }
        }
      }
    );
    const duration = performance.now() - start;
    logger.info(`...Loaded ${this.chain.corpus.length} of ${corpusSize}`);
    logger.info(`Corpus loaded successfully in ${duration / 1000} seconds`);
  }

  public generate(options?: GenerationConfig) {
    const defaults = { from: "", grams: 3, backward: false };
    return this.chain.generate({ ...defaults, ...options });
  }
}
