import fs from 'fs';

let stage_database: any = require ("./stage_table.json").stages
let stage_keys: any[] = Object.keys(stage_database);

let ss_info: any = require("./ss_info.json")

//活动ss和主线详情数据
// const side_storys = act_info.childNodes[0].childNodes;
// const main_storys = act_info.childNodes[1].childNodes;

interface Story{
  type: string,
  childNodes: Episode[]
}

interface Episode{
  episode: string,
  childNodes: Stage[]
}

interface Stage{
  operation: string,
  cn_name: string,
  description: string,
  episode: string,
  custom: any[]         //关卡机制信息
  levelId: string,      //关卡id
  hasChallenge: boolean,
  challenge?: string,    //突袭条件，突袭关才会有
}

const parseStorysData = (data: any) => {
  const storys: Story[] = [];
  const stageKeyMap: { [key: string]: string } = {};
  data.forEach((story_json: any) => {

    const story: Story = {
      type: story_json.story,
      childNodes: []
    }

    story_json.childNodes.forEach((episode_json: any) => {

      const episode: Episode = {
        episode: episode_json.episode,
        childNodes: []
      }

      episode_json.childNodes.forEach((stage_json: any) => {
        const find = stage_keys.find((key: string) => {
          return stage_database[key].code === stage_json.operation;
        })
        const levelPath = stage_database[find]?.levelId?.toLowerCase();

        const stage: Stage = {
          operation: stage_json.operation,
          cn_name: stage_json.cn_name,
          description: stage_json.description,
          episode: stage_json.episode,
          custom: stage_json.custom,
          hasChallenge: stage_json.hasChallenge,
          levelId: levelPath? levelPath : ""
        }
        episode.childNodes.push(stage);

        if(levelPath){
          stageKeyMap[stage.operation] = levelPath;
        }

        //添加突袭关卡
        if(stage_json.hasChallenge){
          let hasTough = false;   //是否是磨难险地类型的关卡
          let {levelId} = stage;
          if(levelId.includes("easy")){
            hasTough = true;
            stage.levelId = levelId.replace("easy","main")
          }

          const challenge = {
            ...stage,
            challenge: stage_json.challenge
          }

          if(hasTough){
            challenge.levelId = levelId.replace("easy","tough");
            challenge.operation += "磨难";
          }else{
            challenge.operation += "突袭";
          }

          
          episode.childNodes.push(challenge);

          if(levelPath){
            stageKeyMap[challenge.operation] = levelPath;
          }
          
        }

      })

      story.childNodes.push(episode);
    })

    storys.push(story);
  });

  return {storys, stageKeyMap};
} 

const data = parseStorysData(ss_info.childNodes);

fs.writeFile('storys.json', JSON.stringify(data, null, 2), (err: any) => {
  if (err) throw err;
  console.log('JSON文件已保存');
});
