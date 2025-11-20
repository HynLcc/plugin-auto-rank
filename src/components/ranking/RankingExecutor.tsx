'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@teable/ui-lib/dist/shadcn/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { usePluginBridge } from '@teable/sdk';
import * as openApi from '@teable/openapi';
import { useMutation } from '@tanstack/react-query';
import { SortFunc, FieldKeyType } from '@teable/core';
import { IRankingConfig, IRecordData } from '../../types';
import { calculateGroupedRanking } from './RankingAlgorithms';
import { useGlobalUrlParams } from '../../hooks/useGlobalUrlParams';
import { useFieldMap } from '../../hooks/useFieldMap';
import { useToast } from '../../hooks/useToast';
import { setAuthToken } from '../../lib/api';

interface IRankingExecutorProps {
  config: IRankingConfig;
  disabled?: boolean;
  onExecuteStart: () => void;
  onExecuteComplete: () => void;
}

export function RankingExecutor({ config, disabled, onExecuteStart, onExecuteComplete }: IRankingExecutorProps) {
  const { t } = useTranslation('common');
  const bridge = usePluginBridge();
  const urlParams = useGlobalUrlParams();
  const [isShowingProgress, setIsShowingProgress] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  
  // 使用记忆化的字段映射
  const fieldNameMap = useFieldMap();

  // 数据获取函数
  const fetchRecords = async () => {
    if (!urlParams.tableId || !config.sourceColumnId) {
      throw new Error('Missing table ID or source field');
    }

    const allRecords: IRecordData[] = [];
    let skip = 0;
    const pageSize = 1000; // 每页1000条记录
    let hasMore = true;

    // 获取字段名称映射
    const sourceFieldName = fieldNameMap[config.sourceColumnId];
    const groupFieldName = config.groupColumnId ? fieldNameMap[config.groupColumnId] : undefined;

    if (!sourceFieldName) {
      throw new Error('Source field not found');
    }

    // 构建字段投影列表（获取必要的字段：id、源字段和分组字段）
    const projection = ['id'];
    if (sourceFieldName) projection.push(sourceFieldName);
    if (groupFieldName) projection.push(groupFieldName);
    // 目标字段不需要在获取阶段读取，只在更新时写入

    // 使用配置中的视图ID（如果配置了视图），否则使用URL参数中的视图ID
    const viewId = config.viewId || urlParams.viewId;

    // 分页获取所有记录（优化后：只获取id和源字段）
    while (hasMore) {
      const result = await openApi.getRecords(urlParams.tableId, {
        viewId: viewId,
        orderBy: [{ fieldId: config.sourceColumnId, order: SortFunc.Desc }],
        take: pageSize,
        skip: skip,
        projection, // 只投影必要的字段
        fieldKeyType: FieldKeyType.Name // 使用字段名枚举
      });

      const records = result.data.records || [];
      allRecords.push(...records as IRecordData[]);

      // 如果返回的记录数少于pageSize，说明已经获取完所有数据
      if (records.length < pageSize) {
        hasMore = false;
      } else {
        skip += pageSize;
      }
    }

    return allRecords;
  };

  // 执行排名的mutation
  const rankingMutation = useMutation({
    mutationFn: async () => {
      if (!bridge || !config.sourceColumnId || !config.targetColumnId) {
        throw new Error('Missing required configuration');
      }

      onExecuteStart();
      setIsShowingProgress(true);

      try {
        // 重新获取临时token以确保操作权限有效
        try {
          const tokenResponse = await bridge.getSelfTempToken();
          setAuthToken(tokenResponse.accessToken);
        } catch (tokenError) {
          console.error('Failed to refresh temp token:', tokenError);
          throw new Error('无法获取操作权限，请重试');
        }

        // 获取记录数据（只在执行时获取）
        const records = await fetchRecords();

        if (records.length === 0) {
          showWarning(t('ranking.noValidData'), t('ranking.noValidDataCheckTable'));
          return;
        }

        const sourceFieldName = fieldNameMap[config.sourceColumnId];
        const targetFieldName = fieldNameMap[config.targetColumnId];
        const groupFieldName = config.groupColumnId ? fieldNameMap[config.groupColumnId] : undefined;

        if (!sourceFieldName || !targetFieldName) {
          throw new Error('Field mapping not found');
        }

        // 构建排名输入参数
        const rankingInput: any = {
          records,
          sourceColumnId: sourceFieldName,
          sortDirection: config.sortDirection,
          rankingMethod: config.rankingMethod,
          zeroValueHandling: config.zeroValueHandling,
        };

        // 只有当分组字段存在时才添加它
        if (groupFieldName) {
          rankingInput.groupColumnId = groupFieldName;
        }

        const rankingResult = calculateGroupedRanking(rankingInput);

        if (rankingResult.results.length === 0) {
          showWarning(t('ranking.noValidData'), t('ranking.noValidDataDesc'));
          return;
        }

        // 准备更新数据（使用字段名）
        const updateRecords = rankingResult.results.map(result => {
          const record: any = {
            id: result.recordId,
            fields: {},
          };
          if (targetFieldName) {
            record.fields[targetFieldName] = result.rank; // 写入数字而不是字符串
          }
          return record;
        });

        // 批量更新记录
        if (!urlParams.tableId) {
          throw new Error('Missing table ID');
        }

        // 分批处理以避免API限制
        const batchSize = 100;
        const batches = [];
        for (let i = 0; i < updateRecords.length; i += batchSize) {
          batches.push(updateRecords.slice(i, i + batchSize));
        }

        let successCount = 0;
        let failCount = 0;

        for (const batch of batches) {
          try {
            await openApi.updateRecords(urlParams.tableId!, {
              records: batch,
              fieldKeyType: FieldKeyType.Name // 使用字段名枚举而不是字段ID
            });
            successCount += batch.length;
          } catch (error) {
            console.error('Failed to update batch:', error);
            failCount += batch.length;
          }
        }

        // 显示结果
        const isGrouped = !!config.groupColumnId;
        let resultMessage = '';

        if (isGrouped) {
          // 分组排名结果
          const groupCount = (rankingResult as any).groupCount || 1;
          resultMessage = t('ranking.groupedRankingCompleteDesc')
            .replace('{count}', successCount.toString())
            .replace('{groups}', groupCount.toString());
        } else {
          // 普通排名结果
          resultMessage = t('ranking.rankingCompleteDesc')
            .replace('{count}', successCount.toString());
        }

        if (failCount === 0) {
          showSuccess(
            t('ranking.rankingComplete'),
            resultMessage
          );
        } else {
          showWarning(
            t('ranking.rankingPartialComplete'),
            `${resultMessage}，${t('ranking.failedRecords').replace('{fail}', failCount.toString())}`
          );
        }

      } catch (error) {
        console.error('Ranking execution failed:', error);
        showError(t('ranking.rankingFailed'), t('ranking.rankingFailedDesc'));
        throw error;
      }
    },
    onSuccess: () => {
      onExecuteComplete();
      setIsShowingProgress(false);
    },
    onError: () => {
      onExecuteComplete();
      setIsShowingProgress(false);
    },
  });

  const handleExecute = async () => {
    // 直接执行排名，无需任何确认
    rankingMutation.mutate();
  };

  const isExecutingRanking = rankingMutation.isLoading || isShowingProgress;

  const getButtonTitle = () => {
    if (isExecutingRanking) {
      return t('ranking.executing');
    }
    if (disabled) {
      return t('ranking.buttonDisabledHint');
    }
    return t('ranking.executeRanking');
  };

  const shouldShowLoading = isExecutingRanking;
  const shouldButtonBeDisabled = disabled || isExecutingRanking;

  return (
    <Button
      onClick={handleExecute}
      disabled={shouldButtonBeDisabled}
      size="lg"
      className="min-w-32 disabled:opacity-50 disabled:cursor-not-allowed"
      title={getButtonTitle()}
      variant={shouldButtonBeDisabled ? "secondary" : "default"}
    >
      {shouldShowLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('ranking.executing')}
        </>
      ) : (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          {t('ranking.executeRanking')}
        </>
      )}
    </Button>
  );
}