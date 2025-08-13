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

const fbxDirName = "public/fbx";
const fbxDirs = fs.readdirSync(fbxDirName);
const fbxs: {[key: string]: any} = {};

fbxDirs.forEach(name => {
  const trapFiles = fs.readdirSync(`${fbxDirName}/${name}`);
  const fbx = trapFiles.find( file => file.includes(".fbx"));

  if(fbx){
    fbxs[name] = {
      name,
      fbxName: fbx.replace(".fbx",""),
      url: `fbx/${name}/${fbx}`,
    } 
  }
})

const getMeshsKey = (req: any, res: any) => {
  const keys: string[] = req.body.keys;

  const resData: {[key: string]: any} = {
    spine: {},
    fbx:{}
  }
  let error = "敌人mesh文件缺失:";
  let hasError = false;
  keys.forEach(key => {
    const spine = spines[key];
    const fbx = fbxs[key];

    if(spine){
      resData.spine[key] = spine;
    }else if(fbx){
      resData.fbx[key] = fbx;
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
export default getMeshsKey;

