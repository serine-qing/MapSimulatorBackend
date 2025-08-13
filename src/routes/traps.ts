
import fs from "fs";

const spineDirName = "trap/spine";
const fbxDirName = "trap/fbx";
const imageDirName = "trap/image";

const spineDirs = fs.readdirSync("public/" + spineDirName);
const fbxDirs = fs.readdirSync("public/" + fbxDirName);
const imageFiles = fs.readdirSync("public/" + imageDirName);

const traps: {[key: string]: any} = {};
const tokenCards: {[key: string]: any} = {};


spineDirs.forEach(name => {
  const trapFiles = fs.readdirSync(`public/${spineDirName}/${name}`);
  const skel = trapFiles.find( file => file.includes(".skel"));

  if(skel){
    //spine文件
    traps[name] = {
      type: "spine",
      name,
      skel: skel.replace(".skel",""),
      atlas: trapFiles.find( file => file.includes(".atlas"))?.replace(".atlas","")
    } 
  }

})


fbxDirs.forEach(name => {
  const trapFiles = fs.readdirSync(`public/${fbxDirName}/${name}`);
  const fbx = trapFiles.find( file => file.includes(".fbx"));

  if(fbx){
    //fbx文件
    traps[name] = {
      type: "fbx",
      name,
      fbxName: fbx.replace(".fbx",""),
      url: `${fbxDirName}/${name}/${fbx}`,
    } 
  }

})

imageFiles.forEach(name => {
  const trapName = name.replace(".png","");

  //没有fbx和spine的 再用贴图
  if(!traps[trapName]){
    traps[trapName] = {
      type: "image",
      name: trapName,
      image: trapName
    } 
  }

  tokenCards[trapName] = {
    name: trapName,
    image: trapName
  } 

})

const getTrapsKey = (req: any, res: any) => {
  const keys: string[] = req.body.keys;

  const resData: {[key: string]: any[]} = {}
  let error = "trap文件缺失:";
  let hasError = false;
  keys.forEach(key => {
    const trap = traps[key];

    if(trap){
      if(!resData[trap.type]){
        resData[trap.type] = [];
      }
      resData[trap.type].push(trap)
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

//获取能使用的装置图标
const getTokenCards= (req: any, res: any) => {
  const keys: string[] = req.body.keys;

  const resData: any[] = [];
  let error = "tokenCards文件缺失:";
  let hasError = false;
  keys.forEach(key => {
    const tokenCard = tokenCards[key];

    if(tokenCard){
      resData.push(tokenCard)
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

export { getTrapsKey, getTokenCards };