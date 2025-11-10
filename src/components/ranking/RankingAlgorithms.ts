import { IRankingResult, IGroupedRankingResult, IRecordData, IRankingInput, IGroupedRankingInput, IRankingOutput, IGroupedRankingOutput } from './types';

/**
 * 标准排名算法：1, 2, 2, 4（有并列时跳过后续排名）
 * 优化为 O(n log n) 时间复杂度
 */
export function standardRanking(values: (number | null)[]): number[] {
  const ranks = new Map<number, number>();

  // 过滤并排序有效值
  const validValues = values.filter(v => v !== null) as number[];
  const sortedValues = [...validValues].sort((a, b) => b - a);

  // 计算每个值的排名
  let currentRank: number = 1;
  const valueCount = new Map<number, number>();

  // 统计每个值的出现次数
  for (const value of validValues) {
    const currentCount = valueCount.get(value) || 0;
    valueCount.set(value, currentCount + 1);
  }

  // 为唯一值分配排名
  for (let i = 0; i < sortedValues.length; ) {
    const value = sortedValues[i]!;
    const count = valueCount.get(value)!;
    ranks.set(value, currentRank);
    currentRank += count;
    i += count;
  }

  return values.map(v => {
    if (v === null) return 0;
    const rank = ranks.get(v);
    return rank ?? 0;
  });
}

/**
 * 密集排名算法：1, 2, 2, 3（有并列时不跳过排名）
 * 优化为 O(n log n) 时间复杂度
 */
export function denseRanking(values: (number | null)[]): number[] {
  const ranks = new Map<number, number>();

  // 获取唯一值并排序
  const uniqueValues = [...new Set(values.filter(v => v !== null) as number[])]
    .sort((a, b) => b - a);

  // 为每个唯一值分配连续排名
  uniqueValues.forEach((value, index) => {
    ranks.set(value, index + 1);
  });

  return values.map(v => {
    if (v === null) return 0;
    const rank = ranks.get(v);
    return rank ?? 0;
  });
}


/**
 * Parse various value types to number or return null if invalid
 *
 * @param {string | number | null | undefined} value - Value to parse
 * @returns {number | null} Parsed number or null if invalid
 */
function parseNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return isNaN(value) ? null : value;
  }

  if (typeof value === 'string') {
    const num = parseFloat(value.replace(/,/g, ''));
    return isNaN(num) ? null : num;
  }

  return null;
}

/**
 * 执行排名计算
 */
export function calculateRanking(input: IRankingInput): IRankingOutput {
  const { records, sourceColumnId, sortDirection, rankingMethod, zeroValueHandling } = input;

  // 提取数值并过滤无效数据
  const valueMap = new Map<string, number | null>();
  let skippedCount = 0;

  records.forEach(record => {
    const rawValue = record.fields[sourceColumnId];
    // 处理查找字段返回的数组数据，取第一个值
    const processedValue = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    const parsedValue = parseNumber(processedValue);

    // 根据0值处理策略决定是否跳过
    if (parsedValue === null) {
      skippedCount++;
      return;
    }

    if (zeroValueHandling === 'skipZero' && parsedValue === 0) {
      skippedCount++;
      return;
    }

    valueMap.set(record.id, parsedValue);
  });

  if (valueMap.size === 0) {
    return {
      results: [],
      processedCount: 0,
      skippedCount,
    };
  }

  // 准备排名计算的值数组
  const recordIds = Array.from(valueMap.keys());
  const values: number[] = [];
  for (const id of recordIds) {
    const value = valueMap.get(id);
    if (value !== null && value !== undefined) {
      values.push(value);
    }
  }

  // 根据排序方向调整值
  let adjustedValues = values;
  if (sortDirection === 'asc') {
    // 升序排名：数值越小排名越高，所以我们取负数来复用降序逻辑
    adjustedValues = values.map(v => -v);
  }

  // 根据排名方法计算排名
  let ranks: number[];
  switch (rankingMethod) {
    case 'standard':
      ranks = standardRanking(adjustedValues);
      break;
    case 'dense':
      ranks = denseRanking(adjustedValues);
      break;
    default:
      ranks = standardRanking(adjustedValues);
  }

  // 构建结果
  const results: IRankingResult[] = recordIds.map((recordId, index) => ({
    recordId,
    rank: ranks[index]!,
  }));

  return {
    results,
    processedCount: results.length,
    skippedCount,
  };
}

/**
 * Get human-readable name for group value
 *
 * @param {string | number | boolean | null | undefined} groupValue - Group value to format
 * @returns {string} Human-readable group name
 */
function getGroupName(groupValue: string | number | boolean | null | undefined): string {
  if (groupValue === null || groupValue === undefined || groupValue === '') {
    return '未分组';
  }

  if (Array.isArray(groupValue)) {
    return groupValue.join(', ') || '未分组';
  }

  if (typeof groupValue === 'object' && groupValue !== null && 'name' in groupValue) {
    const obj = groupValue as { name?: string };
    return obj.name || String(groupValue);
  }

  return String(groupValue);
}

/**
 * 分组排名计算
 */
export function calculateGroupedRanking(input: IGroupedRankingInput): IGroupedRankingOutput {
  const { records, sourceColumnId, groupColumnId, sortDirection, rankingMethod, zeroValueHandling } = input;

  // 如果没有分组字段，使用原有算法
  if (!groupColumnId) {
    const originalResult = calculateRanking(input);
    return {
      results: originalResult.results,
      processedCount: originalResult.processedCount,
      skippedCount: originalResult.skippedCount,
      groupCount: 1,
    };
  }

  // 按分组字段对记录进行分类
  const groups = new Map<any, IRecordData[]>();
  let skippedCount = 0;

  records.forEach(record => {
    const groupValue = record.fields[groupColumnId];

    // 处理查找字段返回的数组数据，取第一个值
    const processedGroupValue = Array.isArray(groupValue) ? groupValue[0] : groupValue;

    // 如果分组值为空，归类到'未分组'
    const groupKey = processedGroupValue === null || processedGroupValue === undefined || processedGroupValue === ''
      ? '未分组'
      : processedGroupValue;

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    const group = groups.get(groupKey);
    if (group) {
      group.push(record);
    }
  });

  
  // 对每个分组内的记录进行排名计算
  const allResults: IGroupedRankingResult[] = [];
  let totalProcessedCount = 0;

  groups.forEach((groupRecords, groupValue) => {
    // 为当前分组创建排名输入
    const groupInput: IRankingInput = {
      records: groupRecords,
      sourceColumnId,
      sortDirection,
      rankingMethod,
      zeroValueHandling,
    };

    // 计算分组内的排名
    const groupResult = calculateRanking(groupInput);

    // 为每个结果添加分组信息
    const groupResults: IGroupedRankingResult[] = groupResult.results.map(result => ({
      ...result,
      groupValue,
      groupName: getGroupName(groupValue),
    }));

    allResults.push(...groupResults);
    totalProcessedCount += groupResult.processedCount;
    skippedCount += groupResult.skippedCount;
  });

  
  return {
    results: allResults,
    processedCount: totalProcessedCount,
    skippedCount,
    groupCount: groups.size,
  };
}