import fs from "fs"

const activities = "act44side";
//campaign即剿灭关卡，operation是地区名 所以需要特殊处理
const isCamp = true;

let stage_database: any = require ("./stage_table.json").stages
//全部关卡的key
let stage_keys: any[] = Object.keys(stage_database);

let stageJSON:any = {
  childNodes:[]
};

stage_keys.forEach(key => {
  if(key.includes(activities) && !key.includes("#f#")){
    const findStage = stage_database[key];
    const challenge = findStage.hardStagedId;
    if(!findStage.levelId) return; //非战斗
    const stage = {
      operation: findStage.code,
      levelId: findStage.levelId.toLowerCase(),
      cn_name: findStage.name,
      description: findStage.description,
      hasChallenge: !!challenge,
    }

    if(isCamp){
      stage.operation = `${findStage.code} ${findStage.name}`;
      stage.cn_name = "";
    }

    stageJSON.childNodes.push(stage)

    if(challenge){
      const challengeStage = {
        ...stage,
        challenge: stage_database[challenge].description
      }
      challengeStage.operation += " 突袭"

      stageJSON.childNodes.push(challengeStage)
    }
    
  }
})

fs.writeFile('activities.json', JSON.stringify(stageJSON, null, 2), (err: any) => {
  if (err) throw err;
  console.log('JSON文件已保存');
});