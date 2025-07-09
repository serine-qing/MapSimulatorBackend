import express from "express";
import fs from "fs";

const router = express.Router();

const trapDirs = fs.readdirSync("public/trap");
const traps: {[key: string]: any} = {};

trapDirs.forEach(name => {
  const trapFiles = fs.readdirSync(`public/trap/${name}`);

  const skel = trapFiles.find( file => file.includes(".skel"));
  const fbx = trapFiles.find( file => file.includes(".fbx"));

  if(skel){
    //spine文件
    traps[name] = {
      type: "spine",
      skel: skel.replace(".skel",""),
      atlas: trapFiles.find( file => file.includes(".atlas"))?.replace(".atlas","")
    } 
  }else if(fbx){
    //fbx文件
    traps[name] = {
      type: "fbx",
      fbx: fbx.replace(".fbx","")
    } 
  }

})


router.post("/getTrapsKey", (req: any, res: any) => {
  const keys: string[] = req.body.keys;

  const resData: {[key: string]: any[]} = {}
  keys.forEach(key => {
    const trap = traps[key];
    if(trap){
      if(!resData[trap.type]){
        resData[trap.type] = [];
      }
      resData[trap.type].push(trap)
    }else{
      console.log(`trap文件缺失:${key}!`);
    }
  })

  res.send(resData);
})

export default router;