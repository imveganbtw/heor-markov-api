import phraseDB, { Phrase } from "./phrase_db";
import logger from "./logger";

class Markov {
    public async getCorpusSize(): Promise<number> {
        return await phraseDB.getDocumentCount();
    }
    public async loadCorpus(): Promise<void> {
        const cursor = phraseDB.getCursor();
        const corpusSize = await this.getCorpusSize();
        logger.info(`Starting corpus load from Phrase DB. Estimated size: ${corpusSize} documents`);
        await cursor.forEach((document) => {
            const phrase:Phrase = {
                author_id: document.author_id,
                phrase: document.phrase,
                metadata: document.metadata || {}
            }
            console.log(phrase);
        })

    }
}

const markov = new Markov();
export default markov as Markov;
