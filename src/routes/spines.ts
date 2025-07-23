//敌人spines
import fs from "fs";

const spineDirName = "public/spine";
const spineDirs = fs.readdirSync(spineDirName);
const spines: {[key: string]: any} = {};

spineDirs.forEach(name => {
  const trapFiles = fs.readdirSync(`${spineDirName}/${name}`);
  const skel = trapFiles.find( file => file.includes(".skel"));
  const atlas = trapFiles.find( file => file.includes(".atlas"));

  if(skel && atlas){
    //spine文件
    spines[name] = {
      skel,
      atlas
    } 
  }

})

const getSpinesKey = (req: any, res: any) => {
  const keys: string[] = req.body.keys;

  const resData: {[key: string]: any} = {}
  let error = "spine文件缺失:";
  let hasError = false;
  keys.forEach(key => {
    const spine = spines[key];

    if(spine){
      resData[key] = spine;
    }else{
      hasError = true;
      error += ` ${key}`;
    }
  })

  res.send({
    data: resData,
    error: hasError? error : null
  });
};
export default getSpinesKey;

