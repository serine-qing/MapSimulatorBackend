//将文件夹下的文件全部取出来
import fs from "fs"

const floderName = "000"
const dirName = `public/${floderName}/`;
const dirArr = fs.readdirSync(dirName)

dirArr.forEach(dir2 => {
  const fileArr = fs.readdirSync(`${dirName}${dir2}/`);
  fileArr.forEach(fileName => {
    const oldName = `${dirName}${dir2}/${fileName}`;
    const newName = `${dirName}${fileName}`
    fs.renameSync(oldName, newName);
  })
})