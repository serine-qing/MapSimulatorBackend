

const parseStoryJSON = (stage_table: any, episode: string, lang: "CN" | "JP" | "EN" | "KR") => {
  const stageDatabase = stage_table.stages;
  const sixStarRuneData = stage_table.sixStarRuneData;
  const keys = Object.keys(stageDatabase);

  const childNodes: any[] = [];

  //三种不同的突袭名
  let cmName1 = "";
  let cmName2 = "";
  let cmName3 = "";
  switch (lang) {
    case "CN":
      cmName1 = "突袭";
      cmName2 = "磨难";
      cmName3 = "险地";
      break;
    case "JP":
      cmName1 = "強襲";
      cmName2 = "厄難";
      cmName3 = "危地";
      break;
    case "EN":
      cmName1 = "CM ";
      cmName2 = "CM ";
      cmName3 = "CM ";
      break;
    case "KR":
      cmName1 = "CM ";
      cmName2 = "CM ";
      cmName3 = "CM ";
      break;
  }

  keys.forEach(key => {
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
      const findStage = stageDatabase[key];
      const challenge = findStage.hardStagedId;
      if(!findStage.levelId) return; //非战斗
      const stage:{[key: string]: any} = {
        id: findStage.code,
        operation: findStage.code,
        levelId: findStage.levelId.toLowerCase(),
        name: findStage.name,
        description: findStage.description,
        hasChallenge: !!challenge,
      }

      childNodes.push(stage)

      if(challenge){
        const challengeStage:{[key: string]: any} = {
          ...stage,
          challenge: stageDatabase[challenge].description
        }
        challengeStage.id += "CM";
        challengeStage.operation = cmName1 + challengeStage.operation;

        childNodes.push(challengeStage)
      }else if(toughStage && key.includes(toughStage)){
        //磨难
        stage.id += "CM";
        stage.operation = cmName2 + stage.operation;
      }else if(findStage.difficulty === "SIX_STAR"){
        //沙盘推演
        stage.id += "CM";
        stage.operation = cmName3 + stage.operation;
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
