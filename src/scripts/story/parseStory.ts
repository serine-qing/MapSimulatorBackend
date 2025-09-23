//所有活动的id从 gamedata\excel\activity_table.json 获取

import fs from 'fs';
import 'tsconfig-paths/register'; 
import parseStoryJSON from './parseStoryJSON';
import parseCamp from './parseCamp';

import {Stage, Story} from "./story"

//全息作战矩阵
const recalRunes = {
  "type": "全息作战矩阵",
  "stage": true,
  "childNodes":[
    {
      "operation": "7-18",
      "levelId": "obt/recalrune/level_recalrune_01-01",
      "name": "",
      "description": "",
      "hasChallenge": false
    },
    {
      "operation": "LS-4",
      "levelId": "obt/recalrune/level_recalrune_01-02",
      "name": "",
      "description": "",
      "hasChallenge": false
    },
    {
      "operation": "H5-1",
      "levelId": "obt/recalrune/level_recalrune_01-03",
      "name": "",
      "description": "",
      "hasChallenge": false
    },
    {
      "operation": "H9-2",
      "levelId": "obt/recalrune/level_recalrune_01-04",
      "name": "",
      "description": "",
      "hasChallenge": false
    }
  ]
}
const crisis_v2 = {
  "type": "危机合约RE",
  "childNodes":[
    {
      "episode": "#4 弧光作战",
      "childNodes": [
        {
          "operation": "常驻图 滞空焦点",
          "name": "",
          "description": "还没有做Tag选择，仅供参考！",
          "challenge": "",
          "episode": "#4 弧光作战",
          "hasChallenge": false,
          "levelId": "obt/crisis/v2/level_crisis_v2_04-01"
        },
        {
          "operation": "轮换图 熔炉检修口",
          "name": "",
          "description": "还没有做Tag选择，仅供参考！",
          "challenge": "",
          "episode": "#4 弧光作战",
          "hasChallenge": false,
          "levelId": "obt/crisis/v2/level_crisis_v2_04-03"
        },
        {
          "operation": "轮换图 巫诅骸地",
          "name": "",
          "description": "还没有做Tag选择，仅供参考！",
          "challenge": "",
          "episode": "#4 弧光作战",
          "hasChallenge": false,
          "levelId": "obt/crisis/v2/level_crisis_v2_04-05"
        }
      ]
    }
  ]
}

const importJSON = async (lang: "CN" | "JP" | "EN" | "KR") => {
  const stage_table = await import(`@/database/${lang.toLowerCase()}/stage_table.json`);
  const activity_table = await import(`@/database/${lang.toLowerCase()}/activity_table.json`);
  const basicInfo = activity_table.basicInfo;
  const zone_table = await import(`@/database/${lang.toLowerCase()}/zone_table.json`);
  const zones = Object.values(zone_table.zones);
  return {stage_table, basicInfo, zones};
}

//活动关卡按照时间顺序排名的ids
const sideStorys: Story[] = [];
const mainStorys: Story[] = [];
const CampStages: {[key: string]: Stage[]} = {
  CN: [], JP: [], EN: [], KR: []
};

const ss_info: any = require("./ss_info.json");
const ss_info_data = ss_info.find((c: any) => c.story === "活动关卡").childNodes;

const parseNodeData = (storys: Story[], stage_table: any, lang: "CN" | "JP" | "EN" | "KR") => {
  storys.forEach(story => {
    const childNodes = parseStoryJSON(stage_table, story.id, lang);
    if(childNodes.length === 0){
      console.error(`${lang} ${story.CNName}未获取到数据！`)
    }
    story[`${lang}Nodes`] = childNodes;
  })
}

const parseZonesData = (storys: Story[] , zones: any[], lang: "CN" | "JP" | "EN" | "KR") => {
  let mainIndex = 0;
  //主线
  zones.forEach(zone => {
    if(
      (zone.type === "MAINLINE" || zone.type === "MAINLINE_ACTIVITY") && 
      zone.zoneNameSecond
    ){
      if(lang === "CN"){
        storys.push({
          id: `main_${ mainIndex < 10 ? "0" + mainIndex : mainIndex}`,
          CNName: zone.zoneNameSecond,
          JPName: '',
          ENName: '',
          KRName: '',
          CNNodes: [],
          JPNodes: [],
          ENNodes: [],
          KRNodes: []
        })
      }else{
        storys[mainIndex][`${lang}Name`] = zone.zoneNameSecond;
      }
      mainIndex++;
    }
  })
}

const parseBaseData = async () => {
  const {stage_table, basicInfo, zones} = await importJSON("CN");
  //sidestory
  const basicInfoCNArr: any[] = Object.values(basicInfo);
  ss_info_data.forEach((ss: any) => {
    const name = ss.episode;
    let id: string;
    if(name.includes("引航者试炼")){
      const num = parseInt(name.match(/\d+/)[0]);
      id = `act${num}bossrush`;
    }else{
      switch (name) {
        case "骑兵与猎人":
          id = "a001";
          break;
        case "火蓝之心":
          id = "a003";
          break;
        default:
          id = basicInfoCNArr.find((item: any) => item.name === name)?.id;
          break;
      }
      
    }
    
    if(id){
      sideStorys.push({
        id,
        CNName: name,
        JPName: '',
        ENName: '',
        KRName: '',
        CNNodes: [],
        JPNodes: [],
        ENNodes: [],
        KRNodes: [],
      })
    }else{
      console.log(`${name}未找到`)
    }
  });

  parseNodeData(sideStorys, stage_table, "CN");

  //主线
  parseZonesData(mainStorys, zones, "CN");

  parseNodeData(mainStorys, stage_table, "CN");

  //剿灭
  CampStages.CN = parseCamp(stage_table);
  writeFile("CN");
}

const parseInternationalData = async (lang: "JP" | "EN" | "KR") => {
  const {stage_table, basicInfo, zones} = await importJSON(lang);

  //支线
  sideStorys.forEach(story => {
    let id = story.id;
    switch (id) {
      case "a001":
        id = "1stact";
        break;
      case "a003":
        id = "act3d0";
        break;
    }

    const ss = basicInfo[id];
    if(ss){
      story[`${lang}Name`] = ss.name;
    }
  })
  parseNodeData(sideStorys, stage_table, lang);

  //主线
  parseZonesData(mainStorys, zones, lang);
  parseNodeData(mainStorys, stage_table, lang);

  //剿灭
  CampStages[lang] = parseCamp(stage_table);
  
  completeInternationalData(lang);
  writeFile(lang);
}

//用CN数据补全国际服缺失数据
const completeInternationalData = (lang: "JP" | "EN" | "KR") => {
  sideStorys.forEach(story => {
    if(!story[`${lang}Name`]){
      story[`${lang}Name`] = story.CNName;
    }
    if(story[`${lang}Nodes`].length === 0){
      story[`${lang}Nodes`] = story.CNNodes;
    }
  })
  mainStorys.forEach(story => {
    if(!story[`${lang}Name`]){
      story[`${lang}Name`] = story.CNName;
    }
    if(story[`${lang}Nodes`].length === 0){
      story[`${lang}Nodes`] = story.CNNodes;
    }
  })

  const CNCampLength = CampStages.CN.length;  //剿灭总数
  const campLength = CampStages[lang].length;
  for(let i = campLength; i < CNCampLength; i ++){
    CampStages[lang][i] = CampStages.CN[i];
  }
}

const writeFile = (lang: "CN" | "JP" | "EN" | "KR") => {
  let sideName, mainName, campName;
  switch (lang) {
    case "CN":
      sideName = "活动关卡";
      mainName = "主线关卡";
      campName = "剿灭作战";
      break;
    case "JP":
      sideName = "イベントステージ";
      mainName = "メインテーマ";
      campName = "殲滅作戦";
      break;
    case "EN":
      sideName = "Events";
      mainName = "Main Stories";
      campName = "Annihilation";
      break;
    case "KR":
      sideName = "이벤트 스테이지";
      mainName = "메인 스테이지";
      campName = "섬멸작전";
      break;
  }
  const sideData: any = {
    type: sideName,
    childNodes: [],
  }
  const mainData: any = {
    type: mainName,
    childNodes: [],
  }

  const campData: any = {
    type: campName,
    stage: true,
    childNodes: CampStages[lang],
  }

  const data = {
    storys: [
      sideData, mainData, recalRunes, crisis_v2, campData
    ]
  }

  sideData.childNodes = sideStorys.map(ss => {
    const data = {
      id: ss.id,
      episode: ss[`${lang}Name`],
      childNodes: ss[`${lang}Nodes`],
    };
    if(lang !== "CN") ss[`${lang}Nodes`] = []; //清空缓存
    return data;
  })

  mainData.childNodes = mainStorys.map(ss => {
    const data = {
      episode: ss[`${lang}Name`],
      childNodes: ss[`${lang}Nodes`],
    };
    if(lang !== "CN") ss[`${lang}Nodes`] = []; //清空缓存
    return data;
  })

  fs.writeFile(`story${lang}.json`, JSON.stringify(data, null, 2), (err: any) => {
    if (err) throw err;
    console.log(`${lang} JSON文件已保存`);
  });
  
}

const parseData = async() => {
  await parseBaseData();
  await parseInternationalData("JP");
  await parseInternationalData("EN");
  await parseInternationalData("KR");

}


parseData();