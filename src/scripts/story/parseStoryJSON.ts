const stage_table = require ("./stage_table.json");
const stage_database: any = stage_table.stages
const sixStarRuneData: any = stage_table.sixStarRuneData

//全部关卡的key
let stage_keys: any[] = Object.keys(stage_database);

const parseStoryJSON = (episode: string, isCamp: boolean) => {
  const childNodes: any[] = [];
  stage_keys.forEach(key => {
    let HStage;      //H关
    let toughStage;  //磨难
    if(episode.includes("main")){
      //主线
      HStage = episode.replace("main", "hard");
      switch (episode) {
        case "main_10":
        case "main_11":
        case "main_12":
        case "main_13":
        case "main_14":
          toughStage = episode.replace("main", "tough");
          break;
      }
    }
    if((
        key.includes(episode) || 
        toughStage && key.includes(toughStage) || 
        HStage && key.includes(HStage)
      ) && 
      !key.includes("#f#")
    ){
      const findStage = stage_database[key];
      const challenge = findStage.hardStagedId;
      if(!findStage.levelId) return; //非战斗
      const stage:{[key: string]: any} = {
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

      childNodes.push(stage)

      if(challenge){
        const challengeStage:{[key: string]: any} = {
          ...stage,
          challenge: stage_database[challenge].description
        }
        challengeStage.operation = "突袭" + challengeStage.operation;

        childNodes.push(challengeStage)
      }else if(key.includes(toughStage)){
        //磨难险地
        stage.operation = "磨难" + stage.operation;
      }else if(findStage.difficulty === "SIX_STAR"){
        //沙盘推演
        stage.operation = "险地" + stage.operation;
        stage.sandTable = [];
        const mapKey = key.replace("#s", "");
        Object.keys(sixStarRuneData).forEach(sixStarKey => {
          if(sixStarKey.includes(mapKey)){
            stage.sandTable.push( sixStarRuneData[sixStarKey] )
          }
        })
      }
      
    }
  })

  return childNodes;
}

export default parseStoryJSON;
