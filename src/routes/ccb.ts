import { accuracyNum } from "../utilities";
import express from "express";
const router = express.Router();

const blue = "#0080ff";
const red = "#ff2020";

// 处理词条描述：替换占位符为实际值
const parseDescription = (descArr: any[], runes: any[]) => {
  descArr.forEach((text: string, index: number) => {
    const regex = /{([^:}+]+)(?::\d+%?)?}/g;
    let match;

    while (match = regex.exec(text)) {
      const hasPercent = match[0].includes("%");
      const hasColon = match[0].includes(":0");
      const key = match[1];

      let value: number | undefined;
      runes.find((rune: any) => {
        value = rune.blackboard.find((item: any) => item.key === key)?.value;
        return value;
      });

      if (value) {
        descArr[index] = hasPercent
          ? descArr[index].replace(`{${key}:0%}`, accuracyNum(value * 100) + "%")
          : hasColon
            ? descArr[index].replace(`{${key}:0}`, value)
            : descArr[index].replace(`{${key}}`, value);
      }
    }
  });
}

// 处理词条数据
const parseRune = (runeId: string, data: any) => {
  const description = data.packedRune?.description || '';

  let processedDesc: string[];
  if (typeof description === 'string') {
    processedDesc = description
      .replaceAll(`<@crisisv2.pos>`, `<span style="color:${blue}">`)
      .replaceAll(`<@crisisv2.nag>`, `<span style="color:${red}">`)
      .replaceAll(`</>`, `</span>`)
      .split("\r\n")
      .filter((line: string) => line.trim() !== '');
  } else {
    processedDesc = [];
  }

  const packedRune = {
    id: data.packedRune?.id || runeId,
    points: data.packedRune?.points || 0,
    mutexGroupKey: data.packedRune?.mutexGroupKey || null,
    runes: (data.packedRune?.runes || []).map((rune: any) => ({
      key: rune.key,
      blackboard: rune.blackboard || []
    }))
  };

  parseDescription(processedDesc, packedRune.runes);

  return {
    runeId,
    runeGroupId: data.runeGroupId || '',
    runeIcon: data.runeIcon || '',
    runeName: data.runeName || '',
    score: data.score || 0,
    description: processedDesc,
    packedRune
  };
}

// ==================== Y 轴压缩算法 ====================
// 与前端 CrisisContractMap.vue 中的布局常量保持一致
const SCALE = 1.5
const OFFSET_Y = 800
const NODE_HEIGHT = 80
const PACK_INDICATOR_HEIGHT = 60
const GAP_THRESHOLD = 40
const TARGET_TOP = 10

interface PackInterval {
  packId: string | null
  minY: number
  maxY: number
}

/**
 * 
 * @param nodes 压缩Y轴
 */
const computeYAxisCompression = (nodes: any[]) => {
  // 1. 收集所有节点，按 pack 分组计算区间
  const packIntervals = new Map<string | null, { minY: number, maxY: number }>()

  nodes.forEach((node) => {
    const pos = node.position
    if (!pos) return

    const centerY = -pos.y * SCALE + OFFSET_Y
    const top = centerY - NODE_HEIGHT / 2
    const bottom = centerY + NODE_HEIGHT / 2
    const packId = node.slotPackId || null

    if (!packIntervals.has(packId)) {
      const adjustedMinY = packId !== null ? top - PACK_INDICATOR_HEIGHT : top
      packIntervals.set(packId, { minY: adjustedMinY, maxY: bottom })
    } else {
      const interval = packIntervals.get(packId)!
      const adjustedTop = packId !== null ? top - PACK_INDICATOR_HEIGHT : top
      interval.minY = Math.min(interval.minY, adjustedTop)
      interval.maxY = Math.max(interval.maxY, bottom)
    }
  })

  // 2. 转换为数组并排序（排除 null pack，即 START 节点）
  const sortedPacks: PackInterval[] = Array.from(packIntervals.entries())
    .map(([packId, interval]) => ({ packId, ...interval }))
    .filter(p => p.packId !== null)
    .sort((a, b) => a.minY - b.minY)

  // 如果没有 pack，返回空压缩
  if (sortedPacks.length === 0) {
    return { packOffsets: {}, maxOffset: 0, sortedPacks: [] }
  }

  // 3. 找出所有空隙（>40px 的）
  const gaps: Array<{ start: number, end: number, size: number }> = []
  for (let i = 1; i < sortedPacks.length; i++) {
    const prev = sortedPacks[i - 1]
    const curr = sortedPacks[i]
    const gap = curr.minY - prev.maxY

    if (gap > GAP_THRESHOLD) {
      gaps.push({
        start: prev.maxY,
        end: curr.minY,
        size: gap - GAP_THRESHOLD
      })
    }
  }

  // 4. 计算每个 pack 的偏移量
  const firstPackTop = sortedPacks[0]?.minY || 0
  const extraTopOffset = Math.max(0, firstPackTop - TARGET_TOP)

  const packOffsets: Record<string, number> = {}

  sortedPacks.forEach((pack) => {
    let offset = extraTopOffset
    for (const gap of gaps) {
      if (pack.minY > gap.start) {
        offset += gap.size
      }
    }
    packOffsets[pack.packId!] = offset
  })

  const maxOffset = Math.max(...Object.values(packOffsets), 0)

  return { packOffsets, maxOffset, sortedPacks }
}

// 处理地图数据（核心逻辑，从 CrisisContractMap.vue 迁移）
const processMapData = (rawData: any, mapId: string) => {
  const detail = rawData.info?.mapDetailDataMap?.[mapId];
  if (!detail) {
    return null;
  }

  // 处理节点数据
  const nodes = Object.entries(detail.nodeDataMap || {}).map(([id, data]: [string, any]) => {
    const pos = detail.nodeViewData?.nodePosMap?.[id]?.position || { x: 0, y: 0 };
    return {
      id,
      nodeType: data.nodeType,
      runeId: data.runeId || null,
      slotPackId: data.slotPackId || null,
      mutualExclusionGroup: data.mutualExclusionGroup || null,
      position: pos
    };
  });

  // 处理道路数据
  const roads = Object.entries(detail.roadRelationDataMap || {})
    .filter(([id, data]: [string, any]) => {
      const roadPos = detail.nodeViewData?.roadPosMap?.[id];
      const startId = data.start?.id;
      const endId = data.end?.id;
      const startIsValidNode = startId && detail.nodeDataMap?.[startId];
      const endIsValidNode = endId && detail.nodeDataMap?.[endId];
      return roadPos &&
        roadPos.centerPos &&
        roadPos.startPos &&
        roadPos.endPos &&
        startIsValidNode &&
        endIsValidNode;
    })
    .map(([id, data]: [string, any]) => {
      const roadPos = detail.nodeViewData.roadPosMap[id];
      return {
        id,
        startId: data.start.id,
        endId: data.end.id,
        positions: roadPos
      };
    });

  // 处理指标集数据
  const packs = Object.entries(detail.bagDataMap || {}).map(([id, data]: [string, any]) => ({
    id,
    slotPackType: data.slotPackType || '',
    slotPackName: data.slotPackName || '',
    slotPackFullName: data.slotPackFullName || '',
    rewardScore: data.rewardScore || 0,
    isDaily: data.isDaily || false,
    sortId: data.sortId || 0
  }));

  // 处理词条数据
  const runes = Object.entries(detail.runeDataMap || {}).map(([id, data]: [string, any]) => {
    return parseRune(id, data);
  });

  // Y 轴压缩
  const { packOffsets, maxOffset, sortedPacks } = computeYAxisCompression(nodes);

  // 获取地图信息
  const stageData = rawData.info?.mapStageDataMap?.[mapId];

  return {
    mapId,
    mapName: stageData?.name || '未知地图',
    mapCode: stageData?.code || '',
    nodes,
    roads,
    packs,
    runes,
    packOffsets,
    maxOffset,
    sortedPacks
  };
}

// ==================== 启动时加载数据 ====================
const ccbData: any = {};

const loadCcbData = () => {
  try {
    const rawData = require(`../database/cn/cc4.json`);
    const mapDetailDataMap = rawData.info?.mapDetailDataMap || {};

    Object.keys(mapDetailDataMap).forEach((mapId: string) => {
      ccbData[mapId] = processMapData(rawData, mapId);
    });

    console.log(`[CCB] Loaded ${Object.keys(ccbData).length} maps`);
  } catch (error) {
    console.error('[CCB] Failed to load data:', error);
  }
}

loadCcbData();

// ==================== 路由 ====================
router.post("/getData", (req: any, res: any) => {
  const { mapId } = req.body;
  res.send({
    data: mapId && ccbData[mapId] ? ccbData[mapId] : null
  })
})

export default router;
