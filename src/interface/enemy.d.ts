interface EnemyRef{
  id: string,
  level: number,
  overwrittenData: any,
  useDb: boolean
}

interface EnemyData{
  key: string,            //敌人id
  attributes: any,        //敌人属性
  levelType: string,      //敌人级别 普通/精英/领袖
  level: number,          //敌人等级
  applyWay: string,
  rangeRadius?: number,     //攻击范围
  motion: string,         //移动motion
  hugeEnemy: boolean,     //是否是巨型敌人
  unMoveable: boolean,   //是否不可移动
  notCountInTotal: boolean,   //非首要目标
  lifePointReduce: number,    //目标价值
  talentBlackboard: any[],   //天赋
  skills: any[],              //技能
}

interface LocalEnemyData extends EnemyData{
  name: string,
  abilityList: any,        //能力描述列表
  description: string,
}

interface ParsedEnemy{
  Key: string,
  Levels: EnemyData[],
  CNName: string,
  CNDescription: string,
  CNAbilityList: any,

  JPName: string,
  JPDescription: string,
  JPAbilityList: any,

  ENName: string,
  ENDescription: string,
  ENAbilityList: any,

  KRName: string,
  KRDescription: string,
  KRAbilityList: any,
}

export {EnemyRef, EnemyData, LocalEnemyData, ParsedEnemy}