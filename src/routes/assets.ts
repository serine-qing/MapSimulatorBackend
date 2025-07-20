import { errorMonitor } from "events";
import express from "express";
import fs from "fs";

const router = express.Router();

const spineDirName = "public/trap/spine";
const fbxDirName = "public/trap/fbx";
const imageDirName = "public/trap/image";

const spineDirs = fs.readdirSync(spineDirName);
const fbxDirs = fs.readdirSync(fbxDirName);
const imageFiles = fs.readdirSync(imageDirName);

const traps: {[key: string]: any} = {};


spineDirs.forEach(name => {
  const trapFiles = fs.readdirSync(`${spineDirName}/${name}`);
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
  const trapFiles = fs.readdirSync(`${fbxDirName}/${name}`);
  const fbx = trapFiles.find( file => file.includes(".fbx"));

  if(fbx){
    //fbx文件
    traps[name] = {
      type: "fbx",
      name,
      fbx: fbx.replace(".fbx","")
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

})

router.post("/getTrapsKey", (req: any, res: any) => {
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
})

export default router;