import express from "express";
import { getTrapsKey, getTokenCards } from "./traps"
import getMeshsKey from "./enemyMesh"

const router = express.Router();

router.post("/getTrapsKey", getTrapsKey)
router.post("/getTokenCards", getTokenCards)
router.post("/getMeshsKey", getMeshsKey)

export default router;