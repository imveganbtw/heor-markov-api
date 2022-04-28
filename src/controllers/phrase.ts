import assert, { AssertionError } from "assert";
import { Request, Response } from "express";
import logger from "../logger";
import { GenerationConfig } from "../markov";
import { Phrase } from "../phrase_db";
import { phraseDb, markov } from "../services";

export default class PhraseController {
  public static async get(req: Request, res: Response): Promise<Response> {
    const options: GenerationConfig = {
      from: req.query.from ? req.query.from.toString() : "",
      grams: req.query.grams ? parseInt(req.query.grams.toString(), 10) : 4,
      backward: false,
    };
    const phrase = markov.generate(options);
    return res.status(200).json({ phrase });
  }

  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const phrase = PhraseController.parsePhrase(req.body);
      const objectID = await phraseDb.createPhrase(phrase);
      return res.status(201).json({ objectID });
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

  private static async storePhrase(phrase: Phrase): Promise<string> {
    try {
      return await phraseDb.createPhrase(phrase);
    } catch (error) {
      logger.error("Failed to store phrase", error);
      throw error;
    }
  }

  private static parsePhrase(body: Record<string, string>): Phrase {
    assert(body.author_id !== undefined, "author_id undefined");
    assert(body.phrase !== undefined, "phrase undefined");
    return {
      author_id: String(body.author_id),
      phrase: String(body.phrase),
      metadata: {},
    };
  }
}
