import 'tsconfig-paths/register';
import fs from 'fs';
import { EnemyData, ParsedEnemy } from "@/interface/enemy";
import { isHugeEnemy } from "@/function/EnemyHelper";

const importJSON = async (lang: "CN" | "JP" | "EN" | "KR") => {

  const enemy_handbook_table = await import(`@/database/${lang.toLowerCase()}/enemy_handbook_table.json`);
  const enemyHandbook = Object.values(enemy_handbook_table.enemyData);

  return {enemyHandbook};
}

const getTalents = (talentBlackboard: any[]) => {
  return talentBlackboard?.map(talent => {
    return {
      key: talent.key,
      value: talent.valueStr? talent.valueStr : talent.value
    }
  })
}

const parsedEnemies: ParsedEnemy[] = [];

const parseCNData = async () => {
  const enemy_database = await import(`@/database/cn/enemy_database.json`) as any;
  let enemies;
  if(enemy_database.enemies){
    //模式1
    enemies = enemy_database.enemies;
  }else{
    //模式2
    enemies = Object.keys(enemy_database);
  }
  
  const {enemyHandbook} = await importJSON("CN");
  enemies.forEach((enemy: any) => {
    
    let key, value;
    if(typeof enemy === "string"){
      //模式2
      key = enemy;
      value = enemy_database[key];
    }else{
      //模式1
      key = enemy.key;
      value = enemy.value;
    }
    //如果使用的是ES6模块，那么当你导入一个模块时，如果该模块使用了export default
    //那么导入的对象会有一个default属性，指向默认导出的内容
    if(key === "default") return;

    const Levels: EnemyData[] = [];
    
    if(!value || !value[0]){
      console.log(`${key}没有数据！`)
    }
    const sourceData = value[0].enemyData;
    if(!sourceData){
      console.error(`Enemy ${key} 数据不存在！`);
      return;
    }
    const talentBlackboard = getTalents(sourceData.talentBlackboard)
    
    let hugeEnemy = false;
    let unMoveable = false;
    if(isHugeEnemy(key)){
      hugeEnemy = true;
      unMoveable = true;
    }

    for(let attrKey in sourceData.attributes){
      sourceData.attributes[attrKey] = sourceData.attributes[attrKey].m_value;
    }
    
    const parsedData: EnemyData= {
      key,
      attributes: sourceData.attributes,
      levelType:sourceData.levelType.m_value,
      level: value[0].level,
      applyWay: sourceData.applyWay.m_value,
      rangeRadius: sourceData.rangeRadius.m_value,  
      motion: sourceData.motion.m_value, 
      hugeEnemy, unMoveable,
      lifePointReduce: sourceData.lifePointReduce.m_value,
      notCountInTotal: sourceData.notCountInTotal.m_value,
      talentBlackboard,
      skills: sourceData.skills,
      enemyTags: sourceData.enemyTags?.m_value
    }
    
    //将rangeRadius放到属性里，更符合逻辑
    parsedData.attributes.rangeRadius = parsedData.rangeRadius;
    delete parsedData.rangeRadius;

    Levels.push(parsedData);

    if(value.length > 1){
      for(let i = 1; i < value.length; i++){
        let overwriteData = value[i].enemyData;

        overwriteData.attributes.rangeRadius = overwriteData.rangeRadius;
        delete overwriteData.rangeRadius;

        let data = {...parsedData};
        data.attributes = {...parsedData.attributes};
        if(parsedData.skills) data.skills = [...parsedData.skills];
        if(parsedData.talentBlackboard) data.talentBlackboard = [...parsedData.talentBlackboard];

        data.level = value[i].level;

        Object.keys(overwriteData).forEach(key => {
          const attr = overwriteData[key];
          if(attr?.m_defined === true){
            //@ts-ignore
            data[key] = attr.m_value;
          }
        });

        const {attributes, talentBlackboard, skills} = overwriteData;

        Object.keys(attributes).forEach(key => {
          const { m_defined, m_value } = attributes[key];

          if(m_defined){
            data.attributes[key] = m_value;
          }
        })

        //覆盖天赋
        getTalents(talentBlackboard)?.forEach(talent => {
          const {key } = talent;
          const findIndex = data.talentBlackboard.find(t => t.key === key);
          if(findIndex > -1){
            data.talentBlackboard[findIndex] = talent;
          }else{
            data.talentBlackboard.push(talent);
          }
        })

        if(!data.skills){
          data.skills = skills;
        } 
        else{
          skills?.forEach((skill: any) => {
            const findIndex = data.skills.findIndex(findSkill => findSkill.prefabKey === skill.prefabKey);
            if(findIndex > -1){
              data.skills[findIndex] = skill;
            }else{
              data.skills.push(skill)
            }
          })
        }

        Levels.push(data);
      }
    }

    const findHandbook: any = enemyHandbook.find((handbook: any) => handbook.enemyId === key);
    let name = findHandbook?.name;
    if(!findHandbook) {
      console.error(`CN ${key}没有获取到Handbook！`);
      name = value[0]["enemyData"]["name"]["m_value"];
    }
    parsedEnemies.push({
      Key: key,
      Levels,
      CNName: name,
      CNDescription: findHandbook?.description,
      CNAbilityList: findHandbook?.abilityList,
      JPName: '',
      JPDescription: '',
      JPAbilityList: undefined,
      ENName: '',
      ENDescription: '',
      ENAbilityList: undefined,
      KRName: '',
      KRDescription: '',
      KRAbilityList: undefined
    })
  });
}

const parseInternationalData = async (lang: "JP" | "EN" | "KR") => {
  const {enemyHandbook} = await importJSON(lang);
  parsedEnemies.forEach(enemy => {
    const key = enemy.Key ? enemy.Key : enemy.key;
    const findHandbook: any = enemyHandbook.find((handbook: any) => handbook.enemyId === key);
    if(findHandbook){
      enemy[`${lang}Name`] = findHandbook.name;
      enemy[`${lang}Description`] = findHandbook.description;
      enemy[`${lang}AbilityList`] = findHandbook.abilityList;
    }else{
      enemy[`${lang}Name`] = enemy.CNName;
      enemy[`${lang}Description`] = enemy.CNDescription;
      enemy[`${lang}AbilityList`] = enemy.CNAbilityList;
    }
  })
}

const outputDir = "src/database/enemyData.json"

const parseData = async() => {
  await parseCNData();
  await parseInternationalData("JP");
  await parseInternationalData("EN");
  await parseInternationalData("KR");

  fs.writeFile(outputDir, JSON.stringify(parsedEnemies, null, 2), (err: any) => {
    if (err) throw err;
    console.log(`JSON文件已保存`);
  });
}

parseData();