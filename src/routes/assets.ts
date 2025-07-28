import express from "express";
import { getTrapsKey, getTokenCards } from "./traps"
import getSpinesKey from "./spines"

const router = express.Router();

router.post("/getTrapsKey", getTrapsKey)
router.post("/getTokenCards", getTokenCards)
router.post("/getSpinesKey", getSpinesKey)

export default router;