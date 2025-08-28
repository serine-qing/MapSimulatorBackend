import express from "express";
const router = express.Router();
const recalRuneData: any = require ("../database/crisis_v2_table.json").recalRuneData.seasons;

const levels: {[key: string]: any} = {};
const parseLevelData = (data: {[key: string]: any}) => {
  const {stageId, runes, levelName, levelCode, levelDesc, fixedRuneSeriesName} = data;
  const parsedRunes = Object.values(runes).map(rune => parseRune(rune))

  levels[stageId] = {
    stageId, levelName, levelCode, levelDesc,
    fixedRuneSeriesName, parsedRunes
  }
}

const parseRune = (rune: any) => {
  const {runeId, sortId, essential, exclusiveGroupId, runeIcon, packedRune} = rune;
  const {points, mutexGroupKey, description, runes} = packedRune;
  return {
    runeId,
    sortId,
    essential,       //是否必选
    exclusiveGroupId,
    runeIcon,
    points,
    description: description.replace(/<@[\s\S]*?>|<\/[\s\S]*?>|\\n/g, "").split("\r\n"),
    runes
  }
}

Object.values(recalRuneData).forEach((season: any) => {
  Object.values(season.stages).forEach((data: any) => {
    parseLevelData(data);
  })
})

router.post("/getData", (req: any, res: any) => {
  const levelId = req.body.levelId;
  res.send({
    data: levelId? levels[levelId] : null
  })
})

export default router;
