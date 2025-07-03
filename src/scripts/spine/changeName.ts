//从github上下载的部分spine文件名有错误，需要处理
//$0->白怪 1->红怪

import fs from "fs"

const dirName = "public/spine/";
const dirArr = fs.readdirSync(dirName)

const suffixArr = [".skel",".atlas"];
const suffixArr2 = [".png", ...suffixArr];

dirArr.forEach(dir => {
  const currentDir = dirName + dir;
  const spines = fs.readdirSync(currentDir)
  const needChange: boolean =  !!spines.find(spine => spine.includes("$0"));

  if(needChange){
    suffixArr.forEach(suffix => {
      const Suffix0 = "$0" + suffix;
      const spine = spines.find(spine => spine.includes( Suffix0 ));

      if(!spine){
        fs.copyFileSync(
          currentDir + "/enemy_" + dir + suffix, 
          currentDir + "/enemy_" + dir + Suffix0
        );
      }

    })
    
    
    suffixArr2.forEach(suffix => {
      fs.renameSync(
        currentDir + "/enemy_" + dir + suffix,
        currentDir + "/enemy_" + dir + "_2" + suffix,
      )
      fs.renameSync(
        currentDir + "/enemy_" + dir + "$0" + suffix,
        currentDir + "/enemy_" + dir + suffix,
      )
    })

    const atlas = fs.readFileSync(currentDir + "/enemy_" + dir + "_2.atlas", 'utf8');
    const changed = atlas.replace(dir + ".png", dir + "_2.png");
    fs.writeFileSync(currentDir + "/enemy_" + dir + "_2.atlas", changed);

    console.log("修改过的文件夹：" + dir);

  }
})
