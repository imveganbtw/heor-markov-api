import express from "express";
import PhraseController from "./controllers/phrase";

const router = express.Router();

router.get("/phrase",async (req,res) => {
  const controller = new PhraseController();
  const response = await controller.get(req, res);
  return response;
});

router.post("/phrase", async (req, res) => {
  const controller = new PhraseController();
  const response = await controller.create(req, res);
  return response;
});

export default router;