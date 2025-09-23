interface RootObject {
  enemies: Enemy[];
}

interface Enemy {
  Key: string;
  Value: Value[];
}

interface Value {
  level: number;
  enemyData: EnemyData;
}

interface EnemyData {
  name: Name;
  description: Description;
  prefabKey: Name;
  attributes: Attributes;
  applyWay: ApplyWay;
  motion: ApplyWay;
  enemyTags: EnemyTags;
  lifePointReduce: MaxHp;
  levelType: ApplyWay;
  rangeRadius: MaxHp;
  numOfExtraDrops: MaxHp;
  viewRadius: MaxHp;
  notCountInTotal: StunImmune;
  talentBlackboard: TalentBlackboard[] | TalentBlackboard2[] | TalentBlackboard3[] | TalentBlackboard3[] | TalentBlackboard5[] | TalentBlackboard5[] | TalentBlackboard7[] | null | null | null;
  skills: Skill[] | Skill[] | Skills3[] | Skills4[] | Skills5[] | Skills5[] | Skills7[] | Skills8[] | Skills9[] | Skills9[] | Skills11[] | Skills11[] | Skills13[] | Skills14[] | Skills15[] | Skills16[] | Skills17[] | Skills17[] | Skills19[] | Skills20[] | Skills21[] | Skills22[] | Skills23[] | Skills23[] | Skills25[] | Skills25[] | Skills27[] | Skills27[] | Skills29[] | null | null | null | null | null | null | null | null | null | null;
  spData: SpDatum | SpDatum | null | null;
}

interface SpDatum {
  spType: string;
  maxSp: number;
  initSp: number;
  increment: number;
}

interface Skills29 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: any[] | null;
}

interface Skills27 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: any[];
}

interface Skills25 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard3[] | TalentBlackboard5[] | null;
}

interface Skills23 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: null;
}

interface Skills22 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard5[];
}

interface Skills21 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard[];
}

interface Skills20 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard[] | any[] | TalentBlackboard5[] | null;
}

interface Skills19 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: (any[] | TalentBlackboard5[] | null)[];
}

interface Skills17 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard5[];
}

interface Skills16 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard3[] | null;
}

interface Skills15 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard[];
}

interface Skills14 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard[] | null;
}

interface Skills13 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: Blackboard2[];
}

interface Blackboard2 {
  key: null;
  value: number;
  valueStr: null;
}

interface Skills11 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard3[];
}

interface Skills9 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard5[] | null;
}

interface Skills8 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: Blackboard[];
}

interface Blackboard {
  key: string;
  value: number;
  valueStr: (null | string)[];
}

interface Skills7 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: (TalentBlackboard5 | TalentBlackboard5[] | null)[];
}

interface Skills5 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard7[];
}

interface Skills4 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: any[] | TalentBlackboard5[] | null;
}

interface Skills3 {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: (TalentBlackboard5 | TalentBlackboard3[] | TalentBlackboard5[] | null)[];
}

interface Skill {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: TalentBlackboard[] | TalentBlackboard5[] | null;
}

interface TalentBlackboard7 {
  key: string;
  value: number;
  valueStr: null | null | string;
}

interface TalentBlackboard5 {
  key: string;
  value: number;
  valueStr: null;
}

interface TalentBlackboard3 {
  key: string;
  value: number;
  valueStr: null | string;
}

interface TalentBlackboard2 {
  key: string;
  value: number;
  valueStr: null | string | string;
}

interface TalentBlackboard {
  key: string;
  value: number;
  valueStr: string;
}

interface EnemyTags {
  m_defined: boolean;
  m_value: string[] | string[] | any[] | any[] | null | null | null;
}

interface ApplyWay {
  m_defined: boolean;
  m_value: string;
}

interface Attributes {
  maxHp: MaxHp;
  atk: MaxHp;
  def: MaxHp;
  magicResistance: MaxHp;
  cost: MaxHp;
  blockCnt: MaxHp;
  moveSpeed: MaxHp;
  attackSpeed: MaxHp;
  baseAttackTime: MaxHp;
  respawnTime: MaxHp;
  hpRecoveryPerSec: MaxHp;
  spRecoveryPerSec: MaxHp;
  maxDeployCount: MaxHp;
  massLevel: MaxHp;
  baseForceLevel: MaxHp;
  tauntLevel: MaxHp;
  epDamageResistance: MaxHp;
  epResistance: MaxHp;
  damageHitratePhysical: MaxHp;
  damageHitrateMagical: MaxHp;
  epBreakRecoverSpeed: MaxHp;
  stunImmune: StunImmune;
  silenceImmune: StunImmune;
  sleepImmune: StunImmune;
  frozenImmune: StunImmune;
  levitateImmune: StunImmune;
  disarmedCombatImmune: StunImmune;
  fearedImmune: StunImmune;
  palsyImmune: StunImmune;
  attractImmune: StunImmune;
}

interface StunImmune {
  m_defined: boolean;
  m_value: boolean;
}

interface MaxHp {
  m_defined: boolean;
  m_value: number;
}

interface Description {
  m_defined: boolean;
  m_value: null | null | string | string;
}

interface Name {
  m_defined: boolean;
  m_value: null | string | string;
}