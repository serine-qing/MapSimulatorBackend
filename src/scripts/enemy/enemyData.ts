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
  const enemy_database = await import(`@/database/cn/enemy_database.json`);
  const enemies = (enemy_database as any).enemies;
  const {enemyHandbook} = await importJSON("CN");

  enemies.forEach((enemy: any) => {
    const Levels: EnemyData[] = [];
    const sourceData = enemy.Value[0].enemyData;
    const talentBlackboard = getTalents(sourceData.talentBlackboard)

    let hugeEnemy = false;
    let unMoveable = false;
    if(isHugeEnemy(enemy.Key)){
      hugeEnemy = true;
      unMoveable = true;
    }

    for(let attrKey in sourceData.attributes){
      sourceData.attributes[attrKey] = sourceData.attributes[attrKey].m_value;
    }
    
    const parsedData: EnemyData= {
      key: enemy.Key,
      attributes: sourceData.attributes,
      levelType:sourceData.levelType.m_value,
      level: enemy.Value[0].level,
      applyWay: sourceData.applyWay.m_value,
      rangeRadius: sourceData.rangeRadius.m_value,  
      motion: sourceData.motion.m_value, 
      hugeEnemy, unMoveable,
      lifePointReduce: sourceData.lifePointReduce.m_value,
      notCountInTotal: sourceData.notCountInTotal.m_value,
      talentBlackboard,
      skills: sourceData.skills,
    }
    
    //将rangeRadius放到属性里，更符合逻辑
    parsedData.attributes.rangeRadius = parsedData.rangeRadius;
    delete parsedData.rangeRadius;

    Levels.push(parsedData);

    if(enemy.Value.length > 1){
      for(let i = 1; i < enemy.Value.length; i++){
        let overwriteData = enemy.Value[i].enemyData;
        let data = {...parsedData};
        data.attributes = {...parsedData.attributes};
        if(parsedData.skills) data.skills = [...parsedData.skills];
        if(parsedData.talentBlackboard) data.talentBlackboard = [...parsedData.talentBlackboard];

        data.level = enemy.Value[i].level;

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

        data.attributes.rangeRadius = data.rangeRadius;
        delete data.rangeRadius;
        Levels.push(data);
      }
    }

    const findHandbook: any = enemyHandbook.find((handbook: any) => handbook.enemyId === enemy.Key);
    if(!findHandbook) console.error(`CN ${enemy.Key}没有获取到Handbook！`)
    parsedEnemies.push({
      Key: enemy.Key,
      Levels,
      CNName: findHandbook?.name,
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
    const findHandbook: any = enemyHandbook.find((handbook: any) => handbook.enemyId === enemy.Key);
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