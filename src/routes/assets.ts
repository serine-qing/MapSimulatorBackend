import express from "express";
import getTrapsKey from "./traps"
import getSpinesKey from "./spines"

const router = express.Router();

router.post("/getTrapsKey", getTrapsKey)
router.post("/getSpinesKey", getSpinesKey)

export default router;