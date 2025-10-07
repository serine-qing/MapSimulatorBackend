

const parseStoryJSON = (stage_table: any, episode: string, lang: "CN" | "JP" | "EN" | "KR") => {
  const stageDatabase = stage_table.stages;
  const sixStarRuneData = stage_table.sixStarRuneData;
  const keys = Object.keys(stageDatabase);
  const isBossrush = episode.includes("bossrush");
  const childNodes: any[] = [];

  //三种不同的突袭名
  let cmName1 = "";
  let cmName2 = "";
  let cmName3 = "";
  let huihong = "";   //恢弘试炼
  let zuizhong = "";  //最终试炼
  switch (lang) {
    case "CN":
      cmName1 = "突袭";
      cmName2 = "磨难";
      cmName3 = "险地";
      huihong = "恢弘试炼"
      zuizhong = "最终试炼"
      break;
    case "JP":
      cmName1 = "強襲";
      cmName2 = "厄難";
      cmName3 = "危地";
      huihong = "恢弘試練"
      zuizhong = "最終試練"
      break;
    case "EN":
      cmName1 = "CM ";
      cmName2 = "CM ";
      cmName3 = "CM ";
      huihong = "Spectacular Trial"
      zuizhong = "Ultimate Trial"
      break;
    case "KR":
      cmName1 = "CM ";
      cmName2 = "CM ";
      cmName3 = "CM ";
      huihong = "상급 시련"
      zuizhong = "최종 시련"
      break;
  }

  keys.forEach(key => {
    let HStage;      //H关
    let toughStage;  //磨难
    if(isBossrush && key.includes("bossrush_tm")) return;  //定向试炼
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
      
      let id = findStage.code;
      let name = findStage.name;
      if(isBossrush){
        id = episode + findStage.code;
        if(key.includes("bossrush_ex")){
          id += "EX";
          name += " " + huihong;
        }else if(key.includes("bossrush_fin")){
          id += "FIN";
          name += " " + zuizhong;
        }

      }
      
      const stage:{[key: string]: any} = {
        id,
        operation: findStage.code,
        levelId: findStage.levelId.toLowerCase(),
        name,
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
