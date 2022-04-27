import assert, { AssertionError } from "assert";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import logger from "../logger";
import phraseDB, { Phrase } from "../phrase_db";
import markov, { GenerationConfig } from "../markov";

export default class PhraseController {

  public async get(req: Request, res: Response): Promise<Response> {
    const options: GenerationConfig = {
      from: req.params.from || "",
      grams: parseInt(req.params.grams) || 4,
      backward: false
    }
    const phrase = markov.generate(options);
    return res.status(200).json({phrase: phrase});
  }

  public async create(req: Request, res: Response): Promise<Response> {    
    try {
      const phrase = this.parsePhrase(req.body);
      const objectID =  await phraseDB.createPhrase(phrase);
      return res.status(201).json({objectID: objectID});
    } catch (error) {
      if (error instanceof AssertionError) {
        logger.info("Received invalid request body", error.message);
        return res.status(400).json({ error: error.message });
      }
      logger.error("Request failed with an error", error);
      logger.debug(error);
      return res.status(500).json(error);
    }
  } 

  private async storePhrase(phrase: Phrase): Promise<string> {
    try {
      return await phraseDB.createPhrase(phrase);
    } catch (error) {
      logger.error("Failed to store phrase", error);
      throw error;
    }
  }

  private parsePhrase(body: ParamsDictionary): Phrase {
    assert(body.author_id != undefined, "author_id undefined");
    assert(body.phrase !== undefined, "phrase undefined");
    return {
      author_id: String(body.author_id),
      phrase: String(body.phrase),
      metadata: {}
    }
  }
}