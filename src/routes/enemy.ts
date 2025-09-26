import { isHugeEnemy } from "../function/EnemyHelper";
import express from "express";
const router = express.Router();
import { ParsedEnemy, EnemyRef, EnemyData, LocalEnemyData } from "@/interface/enemy";
const enemyData: ParsedEnemy[] = require ("../database/enemyData.json");

const getEnemyData  = (enemyRefs:EnemyRef[], lang: "CN" | "JP" | "EN" | "KR"): LocalEnemyData[] => {
  const enemyDatas: LocalEnemyData[] = [];
  enemyRefs.forEach((enemyRef: EnemyRef) => {

    const find = enemyData.find( (e: any) =>{
      return enemyRef.id === e.Key;
    })
    if(find){
      const localEnemyData: LocalEnemyData = {
        ...find.Levels[enemyRef.level],
        name: find[`${lang}Name`],
        abilityList: find[`${lang}AbilityList`],
        description: find[`${lang}Description`]
      }
      enemyDatas.push(localEnemyData);
    }else{
      console.error(`${enemyRef}未找到`)
    }
  })

  return enemyDatas;
}

router.post("/data", (req: any, res: any) => {
  const EnemyRefs: EnemyRef[] = req.body?.enemyRefs;
  const language: "CN" | "JP" | "EN" | "KR" = req.body?.language || "CN";
  const EnemyDatas: LocalEnemyData[] = getEnemyData(EnemyRefs, language);
  res.send({
    data: { EnemyDatas }
  })
})

export default router;
