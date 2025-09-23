interface Story{
  id: string,
  CNName: string,
  JPName: string,
  ENName: string,
  KRName: string,
  CNNodes: any[],
  JPNodes: any[],
  ENNodes: any[],
  KRNodes: any[],
}

interface Stage{
  id: string,
  operation: string,
  name: string,
  description: string,
  levelId: string,
  hasChallenge: boolean
}

export {Story, Stage};