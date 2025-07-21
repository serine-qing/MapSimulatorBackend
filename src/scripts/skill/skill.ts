import fs from 'fs';

const enemy_database: any = require ("../../database/enemy_database.json").enemies;

const talentName = "revive";
const skillName = null;

const talentFind: any = [];
const skillFind: any = [];

enemy_database.forEach((data: any) => {
  const enemy = data.Value[0]?.enemyData;

  if(enemy && talentName){
    const findT = enemy.talentBlackboard?.find((talent: any) => {
      return talent.key.includes(talentName);
    });

    if(findT){
      talentFind.push(enemy);
    }
  }

  if(enemy && skillName){
    const findS = enemy.skills?.find((skill: any) => {
      return skill.prefabKey.includes(skillName);
    });

    if(findS){
      skillFind.push(enemy);
    }
  }

})

fs.writeFile('skills.json', JSON.stringify({
  talent: talentFind,
  skill: skillFind
}, null, 2), (err: any) => {
  if (err) throw err;
  console.log('JSON文件已保存');
});
