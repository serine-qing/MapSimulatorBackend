import fs from "fs"
//或者通过 ts-node 的命令行选项：ts-node -r tsconfig-paths/register xxx.ts
import 'tsconfig-paths/register'; 
import parseStoryJSON from "./parseStoryJSON";

const activities = "main_01";   //主线
// const activities = "act45side";   //支线
//campaign即剿灭关卡，operation是地区名 所以需要特殊处理
const isCamp = false;

let stageJSON:any = {
  childNodes: parseStoryJSON(activities, isCamp)
};

fs.writeFile('activities.json', JSON.stringify(stageJSON, null, 2), (err: any) => {
  if (err) throw err;
  console.log('JSON文件已保存');
});