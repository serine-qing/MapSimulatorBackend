import { Lang } from "@/types/localization";
import { accuracyNum } from "../utilities";
import express from "express";
const router = express.Router();

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
          descArr[index].replace(`{${key}:0%}`, accuracyNum(value * 100) + "%")  //防止出现很长的小数
          : hasColon ? descArr[index].replace(`{${key}:0}`, value) 
            : descArr[index].replace(`{${key}}`, value);
      }
    }
  })
}


const recalData: Record<Lang, {[key: string]: any}> = {
  "CN": {},
  "EN": {},
  "JP": {},
  "KR": {},
};

const parseLevelData = (data: {[key: string]: any}, lang: Lang) => {
  const {stageId, runes, levelName, levelCode, levelDesc, fixedRuneSeriesName} = data;
  const parsedRunes = Object.values(runes).map(rune => parseRune(rune))

  recalData[lang][stageId] = {
    stageId, levelName, levelCode, levelDesc,
    fixedRuneSeriesName, parsedRunes
  }
}


const parseDatas = (lang: Lang) => {
  const recalRuneData: any = require(`../database/${lang.toLowerCase()}/crisis_v2_table.json`).recalRuneData.seasons;
  Object.values(recalRuneData).forEach((season: any) => {
    Object.values(season.stages).forEach((data: any) => {
      parseLevelData(data, lang);
    })
  })
}

parseDatas("CN");
// parseDatas("EN");
// parseDatas("JP");
// parseDatas("KR");

router.post("/getData", (req: any, res: any) => {
  const levelId = req.body.levelId;
  // const language: Lang = req.body.language;
  const language: Lang = "CN";
  
  res.send({
    data: levelId && recalData[language]? recalData[language][levelId] : null
  })
})

export default router;
