//所有活动的id从 gamedata\excel\activity_table.json 获取

import fs from 'fs';
import parseStoryJSON from './parseStoryJSON';
const actTable: any = Object.values(require("./activity_table.json").basicInfo);
const ss_info: any = require("./ss_info.json");

const sideStory = ss_info.find((c: any) => c.story === "活动关卡").childNodes;
const ssMap: any[] = [];
sideStory.forEach((ss: any) => {
  const name = ss.episode;
  let id: any;
  if(name.includes("引航者试炼")){
    const num = parseInt(name.match(/\d+/)[0]);
    id = `act${num}bossrush`;
  }else{
    switch (name) {
      case "骑兵与猎人":
        id = "a001";
        break;
      case "火蓝之心":
        id = "a003";
        break;
      default:
        id = actTable.find((item: any) => item.name === name)?.id;
        break;
    }
    
  }
  
  if(id){
    ssMap.push({
      id,
      name
    })
  }else{
    console.log(`${name}未找到`)
  }
});


const sideData: any = {
  type: "活动关卡",
  childNodes: [],
}

ssMap.forEach(ss => {
  const childNodes = parseStoryJSON(ss.id, false);
  if(childNodes.length === 0){
    console.error(`${ss.name}未获取到数据！`)
  }
  sideData.childNodes.push({
    episode: ss.name,
    childNodes
  })
})

fs.writeFile('side.json', JSON.stringify(sideData, null, 2), (err: any) => {
  if (err) throw err;
  console.log('JSON文件已保存');
});
