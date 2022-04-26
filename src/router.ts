import express from "express";
import PhraseController from "./controllers/phrase";

const router = express.Router();

router.get("/phrases", async (_req, res) => {
  const controller = new PhraseController();
  const response = await controller.getMessage();
  return res.send(response);
});

export default router;