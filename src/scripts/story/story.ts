const fs = require('fs');

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
  levelId: string,
  cn_name: string,
  description: string,
  episode: string
}

const parseStorysData = (data: any):Story[] => {
  const storys: Story[] = [];
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

        const stage: Stage = {
          operation: stage_json.operation,
          levelId: "",
          cn_name: stage_json.cn_name,
          description: stage_json.description,
          episode: stage_json.episode,
        }
        
        if(find){
          stage.levelId = stage_database[find].levelId;
        }

        episode.childNodes.push(stage);

      })
      story.childNodes.push(episode);
    })

    storys.push(story);
  });

  return storys;
} 

const storys:Story[] = parseStorysData(ss_info.childNodes);

fs.writeFile('storys.json', JSON.stringify({storys}), (err: any) => {
  if (err) throw err;
  console.log('JSON文件已保存');
});
