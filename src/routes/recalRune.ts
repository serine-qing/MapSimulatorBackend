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

const blue = "#0080ff";
const red = "#ff2020";

const parseRune = (rune: any) => {
  const {runeId, sortId, essential, exclusiveGroupId, runeIcon, packedRune} = rune;
  const {points, mutexGroupKey, description, runes} = packedRune;
  const descriptionArr = 
    description
      .replaceAll(`<@recalrune.pos>`, `<span style="color:${blue}">`)
      .replaceAll(`<@recalrune.nag>`, `<span style="color:${red}">`)
      .replaceAll(`</>`, `</span>`)
      .split("\r\n");

  parseDescription(descriptionArr, runes);
  return {
    runeId,
    sortId,
    essential,       //是否必选
    exclusiveGroupId,
    runeIcon,
    points,
    description: descriptionArr,
    runes
  }
}

const parseDescription = (descArr: any[], runes: any[]) => {
  descArr.forEach((text, index) => {
    const regex = /{([^:}+]+)(?::\d+%?)?}/g;
    let match;
    
    while(match = regex.exec(text)){
      const hasPercent = match[0].includes("%");   //是否有百分号
      const hasColon = match[0].includes(":0");   //是否有:0

      let key = match[1];
            
      let value;

      runes.find((rune: any) => {
        value = rune.blackboard.find((item: any) => item.key === key)?.value;
        return value;
      })



      if(value){
        descArr[index] = hasPercent? 
          descArr[index].replace(`{${key}:0%}`, value * 100 + "%")
          : hasColon ? descArr[index].replace(`{${key}:0}`, value) 
            : descArr[index].replace(`{${key}}`, value);
      }
    }
  })
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
