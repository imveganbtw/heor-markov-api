import phraseDB, { Phrase } from "./phrase_db";
import logger from "./logger";
import MarkovChain from "purpl-markov-chain";

export interface GenerationConfig {
    from: string,
    grams: number,
    backward: boolean
}

class Markov {
    private chain: MarkovChain = new MarkovChain();

    public async getCorpusSize(): Promise<number> {
        return await phraseDB.getDocumentCount();
    }
    public async loadCorpus(limit = 10000): Promise<void> {
        const corpusSize = Math.max(limit, await phraseDB.getDocumentCount());
        const batchSize = (Math.round(corpusSize/1000)*1000)/5;
        const cursor = phraseDB.getCursor(corpusSize);
        
        logger.info(`Starting corpus load from Phrase DB. Estimated size: ${corpusSize} documents`);
        const start = performance.now();
        let count = 0;
        await cursor.forEach((document) => {
            const phrase:Phrase = {
                author_id: document.author_id,
                phrase: document.phrase,
                metadata: document.metadata || {}
            }
            if (phrase.phrase) {
                count++;

                this.chain.update(phrase.phrase);
                if (count % batchSize === 0) {
                    logger.info(`...Loaded ${count} of ${corpusSize}`)
                }
            }
        });
        const duration = performance.now() - start;
        logger.info(`Corpus loaded successfully in ${duration} milliseconds`);
    }

    public generate(options?: GenerationConfig) {
        const defaults = { from: "", grams: 3, backward: false };
        return this.chain.generate({...defaults, ...options});
    }
}

const markov = new Markov();
export default markov as Markov;
