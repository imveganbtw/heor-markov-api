import express from "express";
import PhraseController from "./controllers/phrase";

const router = express.Router();

router.get("/phrase", async (req, res) => {
  const response = await PhraseController.get(req, res);
  return response;
});

router.post("/phrase", async (req, res) => {
  const response = await PhraseController.create(req, res);
  return response;
});

export default router;
