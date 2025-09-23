import {Stage} from "./story"

const parseCamp = (stage_table: any) => {
  const stageDatabase: any[] = Object.values(stage_table.stages);
  const camps: Stage[] = [];
  stageDatabase.forEach(stage => {
    if(stage.stageType === "CAMPAIGN"){
      camps.push({
        id: stage.stageId,
        operation: `${stage.code} ${stage.name}`,
        name: "",
        description: stage.description,
        levelId: stage.levelId,
        hasChallenge: false
      })
    }
  });
  return camps;
}

export default parseCamp;