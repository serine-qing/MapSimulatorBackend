import fs from "fs"

const storysTable = require("../../../public/json/storys.json");

const dirName = "public/levels/";
const dirArr = fs.readdirSync(dirName)

let allRunes:{ [key: string]: any[] } = {};
const storys = storysTable.storys;

const parseRunes = (runes: any[], path:string) => {
  runes.forEach(rune => {
    const { key }= rune;

    if( !allRunes[key] ){
      allRunes[key] = [];
    }

    const queue: any = [];
    queue.push( {childNodes:storys} );
    let i;

    while(i = queue.shift()){
      if(i.childNodes){
        i.childNodes.forEach((j: any) => {
          queue.push(j)
        })
      }else{
        if(i.levelId === path.toLowerCase().replace(".json","")){
          if(i.hasChallenge){
            if(i.challenge){

              allRunes[key].push({
                operation: i.operation,
                challenge: i.challenge,
                levelId: path
              })
              return;
            }
          }else{
            allRunes[key].push({
              operation: i.operation,
              levelId: path
            })
            return;
          }

        }
      }
    }

  })
}


dirArr.forEach(inner => {
  const innerDir = fs.readdirSync(dirName + inner);
  innerDir.forEach(inner2 => {
    const innerDir2 = fs.readdirSync(dirName + inner + "/" + inner2);
    innerDir2.forEach(stage => {
      const path = inner + "/" + inner2 + "/" + stage;
      if(stage.includes(".json")){
        const buffer = fs.readFileSync(dirName + path,{
          encoding:"utf-8"
        });
        let json = JSON.parse(buffer);
        
        if(json.runes){
          parseRunes(json.runes, path)
        }

      }
    })
    
  })
})

fs.writeFile('runes.json', JSON.stringify(allRunes, null, 2), (err: any) => {
  if (err) throw err;
  console.log('JSON文件已保存');
});
