import puppeteer from 'puppeteer-extra';
import axios from 'axios';
import fs from "fs"

const wait = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(0), Math.random() * 1000);
  });
}

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    slowMo: 50
  });
  const page = await browser.newPage();
  page.setJavaScriptEnabled(true);
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36');
  // Navigate the page to a URL
  await page.goto('https://prts.wiki/index.php?title=属性:装置id&limit=500');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  //trap的链接
  const trapLinks = await page.$$eval(".smwpropname ", els => els.map(
    el => el.querySelector("a")?.href
  ));
  //trap的id 和链接对应
  const trapIds = await page.$$eval(".smwprops ", els => els.map(
    el => el.textContent?.replaceAll("+","").replaceAll(/\s/g, "")
  ));

  for(let i = 92; i<trapLinks.length; i++){
    const link = trapLinks[i];

    await page.goto(link as string);
    const imgIds = trapIds[i]?.split(",");

    let imgsrc;
    try{
      imgsrc = await page.$eval("a.image img", el => el.src)
    }catch(err){
      console.log(`第${i}个 ${imgIds?imgIds[0]:""} 执行失败`);
      continue;
    }

    const { data } = await axios({
      method: 'get', 
      url: imgsrc, 
      responseType: 'arraybuffer'
    });

    imgIds?.forEach(id => {
      fs.writeFileSync(
        `images/${id}.png`,
        data
      );
    })

    console.log(`第${i}个 ${imgIds?imgIds[0]:""} 执行完毕`);
  }

  await browser.close();
})();