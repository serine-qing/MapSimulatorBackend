import fs from "fs"

const activities = "act19mini";

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

    const stage = {
      operation: findStage.code,
      levelId: findStage.levelId.toLowerCase(),
      cn_name: findStage.name,
      description: findStage.description,
      hasChallenge: !!challenge,
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