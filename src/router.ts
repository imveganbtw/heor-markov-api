import express from "express";
import PhraseController from "./controllers/phrase";

const router = express.Router();

router.post("/phrases", async (req, res) => {
  const controller = new PhraseController();
  const response = await controller.create(req, res);
  return response;
});

export default router;