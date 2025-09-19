import fs from 'fs';
import parseStoryJSON from './parseStoryJSON';
const ss_info: any = require("./ss_info.json")

const mainStoryInfo = ss_info.find((ss: any) => ss.story === "主线关卡").childNodes;
const data: any = {
  type: "主线关卡",
  childNodes: [],
}

const mainStoryKeys = [
  "main_00", "main_01", "main_02", "main_03", "main_04", "main_05", "main_06", 
  "main_07", "main_08", "main_09", "main_10", "main_11", "main_12", 
  "main_13", "main_14", "main_15"
]

for(let i = 0; i < mainStoryKeys.length; i++){
  const key = mainStoryKeys[i];
  const episode = mainStoryInfo[i].episode;
  data.childNodes.push({
    episode,
    childNodes: parseStoryJSON(key, false)
  })
}


fs.writeFile('main.json', JSON.stringify(data, null, 2), (err: any) => {
  if (err) throw err;
  console.log('JSON文件已保存');
});
