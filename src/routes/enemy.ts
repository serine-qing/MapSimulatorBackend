export{}

const express = require('express')
const router = express.Router();
const enemy_database: any = require ("../database/enemy_database.json").enemies;

interface EnemyRef{
  id: string,
  level: number,
  overwrittenData: any,
  useDb: boolean
}

interface EnemyData{
  key: string,            //敌人id
  attributes: any,        //敌人属性
  description: string,    //
  levelType: string,      //敌人级别 普通/精英/领袖
  name: string,
  rangeRadius: number,     //攻击范围
  motion: string,         //移动motion
}

const getEnemyData  = ( enemyRefs:EnemyRef[] ): EnemyData[] => {
  const enemyDatas: EnemyData[] = [];

  enemyRefs.forEach((enemyRef: EnemyRef) => {
    const find = enemy_database.find( (e: any) =>{
      return enemyRef.id === e.Key;
    })
    const sourceData = find.Value[0].enemyData;

    const parsedData: EnemyData= {
      key: find.Key,
      attributes: find.Value[enemyRef.level].enemyData.attributes,  
      description: sourceData.description.m_value,
      levelType:sourceData.levelType.m_value,
      name: sourceData.name.m_value,
      rangeRadius: sourceData.rangeRadius.m_value,  
      motion: sourceData.motion.m_value, 
    }

    Object.keys(parsedData.attributes).forEach(attrName => {
      if(typeof parsedData.attributes[attrName] === "object"){
        parsedData.attributes[attrName] = parsedData.attributes[attrName].m_value;
      }
    })

    enemyDatas.push(parsedData);
  })

  return enemyDatas;
}

router.post("/data", (req: any, res: any) => {
  const EnemyRefs: EnemyRef[] = req.body?.enemyRefs;
  const EnemyDatas: EnemyData[] = getEnemyData(EnemyRefs);
  res.send({ EnemyDatas })
})

module.exports = router;
