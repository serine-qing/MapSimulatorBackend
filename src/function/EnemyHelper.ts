const hugeEnemys = [
  "enemy_1521_dslily", //盐风主教昆图斯
  "enemy_1526_sfsui", //岁相
  "enemy_1553_lrdead", //引火的死魂灵
  "enemy_1564_mpprts", //PRTS，“源代码”
  "enemy_2018_csdoll", //伤心的大锁
  "enemy_2119_dyshhj", //“岁”
  "enemy_2054_smdeer", //“萨米的意志”
];

const unMoveableEnemys = [
  
];

const isHugeEnemy = (key: string):boolean => {
  return hugeEnemys.findIndex(enemyKey => enemyKey === key) > -1;
}

export { isHugeEnemy }