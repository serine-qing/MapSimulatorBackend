import { isHugeEnemy } from "../function/EnemyHelper";
import express from "express";
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
  level: number,          //敌人等级
  name: string,
  applyWay: string,
  rangeRadius?: number,     //攻击范围
  motion: string,         //移动motion
  hugeEnemy: boolean,     //是否是巨型敌人
  unMoveable: boolean,   //是否不可移动
  notCountInTotal: boolean,   //非首要目标
  lifePointReduce: number,    //目标价值
  talentBlackboard: any[],   //天赋
  skills: any[]              //技能
}


const getTalents = (talentBlackboard: any[]) => {
  return talentBlackboard?.map(talent => {
    return {
      key: talent.key,
      value: talent.value === null ? talent.valueStr : talent.value
    }
  })
}

const getEnemyData  = ( enemyRefs:EnemyRef[] ): EnemyData[] => {
  const enemyDatas: EnemyData[] = [];

  enemyRefs.forEach((enemyRef: EnemyRef) => {
    const find = enemy_database.find( (e: any) =>{
      return enemyRef.id === e.Key;
    })
    const sourceData = find.Value[0].enemyData;

    const talentBlackboard = getTalents(sourceData.talentBlackboard)

    let hugeEnemy = false;
    let unMoveable = false;
    if(isHugeEnemy(find.Key)){
      hugeEnemy = true;
      unMoveable = true;
    }
    
    const parsedData: EnemyData= {
      key: find.Key,
      attributes: {...sourceData.attributes},  
      description: sourceData.description.m_value,
      levelType:sourceData.levelType.m_value,
      level: enemyRef.level,
      name: sourceData.name.m_value,
      applyWay: sourceData.applyWay.m_value,
      rangeRadius: sourceData.rangeRadius.m_value,  
      motion: sourceData.motion.m_value, 
      hugeEnemy, unMoveable,
      lifePointReduce: sourceData.lifePointReduce.m_value,
      notCountInTotal: sourceData.notCountInTotal.m_value,
      talentBlackboard,
      skills: sourceData.skills
    }


    //敌人级别大于0，需要从用高级别的数据覆盖低级别的数据
    if(enemyRef.level > 0){
      const overwriteData = find.Value[enemyRef.level].enemyData;
      Object.keys(overwriteData).forEach(key => {
        const attr = overwriteData[key];
        if(attr?.m_defined === true){
          //@ts-ignore
          parsedData[key] = attr.m_value;
        }
      });

      const {attributes, talentBlackboard, skills} = overwriteData;

      Object.keys(attributes).forEach(key => {
        const { m_defined, m_value } = attributes[key];

        if(m_defined){
          parsedData.attributes[key] = m_value;
        }
      })

      //覆盖天赋
      getTalents(talentBlackboard)?.forEach(talent => {
        const {key , value} = talent;
        const find = parsedData.talentBlackboard.find(t => t.key === key);
        if(find){
          find.value = value;
        }else{
          parsedData.talentBlackboard.push(talent);
        }
      })

      skills?.forEach((skill: any) => {
        const index = parsedData.skills.findIndex(findSkill => findSkill.prefabKey === skill.prefabKey);
        if(index > -1){
          parsedData.skills[index] = skill;
        }
      })

    }

    Object.keys(parsedData.attributes).forEach(attr => {
      if(typeof parsedData.attributes[attr] === "object"){
        parsedData.attributes[attr] = parsedData.attributes[attr].m_value;
      }
    })
      
    //将rangeRadius放到属性里，更符合逻辑
    parsedData.attributes.rangeRadius = parsedData.rangeRadius;
    delete parsedData.rangeRadius;

    enemyDatas.push(parsedData);
  })

  return enemyDatas;
}

router.post("/data", (req: any, res: any) => {
  const EnemyRefs: EnemyRef[] = req.body?.enemyRefs;
  const EnemyDatas: EnemyData[] = getEnemyData(EnemyRefs);
  res.send({
    data: { EnemyDatas }
  })
})

export default router;
