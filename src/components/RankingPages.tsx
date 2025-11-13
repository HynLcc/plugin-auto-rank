'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@teable/ui-lib/dist/shadcn/ui/card';
import { FieldSelector } from './ranking/FieldSelector';
import { GroupFieldSelector } from './ranking/GroupFieldSelector';
import { RankingConfig } from './ranking/RankingConfig';
import { RankingExecutor } from './ranking/RankingExecutor';
import { IRankingConfig } from './ranking/types';
import { Gauge } from '@teable/icons';

/**
 * Main ranking interface component that provides a complete UI for configuring
 * and executing ranking operations on Teable table records.
 *
 * Features:
 * - Field selection for source data and target ranking column
 * - Group-based ranking configuration
 * - Multiple ranking algorithms (Standard, Dense)
 * - Zero value handling options
 * - Real-time validation and execution feedback
 *
 * @returns {JSX.Element} The main ranking interface component
 */
export function RankingPages() {
  const { t } = useTranslation('common');

  // Default configuration for ranking operations
  const defaultConfig: IRankingConfig = {
    sourceColumnId: '',
    targetColumnId: '',
    sortDirection: 'desc',
    rankingMethod: 'standard',
    zeroValueHandling: 'skipZero',
  };

  // State management for ranking configuration and execution status
  const [rankingConfig, setRankingConfig] = useState<IRankingConfig>(defaultConfig);
  const [isExecuting, setIsExecuting] = useState(false);

  /**
   * Handles configuration changes by merging partial updates with current state.
   * Updates the ranking configuration with new values while preserving existing settings.
   * Properly handles undefined values for optional properties and empty config objects.
   *
   * @param {Partial<IRankingConfig>} config - Partial configuration object with updated values
   */
  const handleConfigChange = (config: Partial<IRankingConfig>) => {
    // If config is empty, no changes needed
    if (Object.keys(config).length === 0) {
      return;
    }

    // Handle optional properties that need to be removed when set to undefined
    const newConfig = { ...rankingConfig };

    // Only include properties that are explicitly provided in config
    Object.keys(config).forEach(key => {
      const value = config[key as keyof IRankingConfig];
      if (value !== undefined) {
        (newConfig as any)[key] = value;
      } else {
        // If value is undefined, remove the property (for optional fields)
        delete (newConfig as any)[key];
      }
    });

    setRankingConfig(newConfig);
  };

  /**
   * Callback function triggered when ranking execution starts.
   * Sets the execution state to true to disable UI controls during processing.
   */
  const handleExecuteStart = () => {
    setIsExecuting(true);
  };

  /**
   * Callback function triggered when ranking execution completes.
   * Resets the execution state to false to re-enable UI controls.
   */
  const handleExecuteComplete = () => {
    setIsExecuting(false);
  };

  /**
   * Validates that the current configuration is complete and valid for execution.
   * Ensures both source and target columns are selected and are different fields.
   *
   * @returns {boolean} True if configuration is valid, false otherwise
   */
  const isConfigValid = rankingConfig.sourceColumnId &&
                        rankingConfig.targetColumnId &&
                        rankingConfig.sourceColumnId !== rankingConfig.targetColumnId;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            {t('ranking.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* 数据列设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('ranking.fieldSettings')}</h3>
            <FieldSelector
              config={rankingConfig}
              onConfigChange={handleConfigChange}
              disabled={isExecuting}
            />
          </div>

          {/* 分组设置 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-lg font-medium">{t('ranking.groupSettings')}</h3>
            <GroupFieldSelector
              config={rankingConfig}
              onConfigChange={handleConfigChange}
              disabled={isExecuting}
            />
          </div>

          {/* 排名规则 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-lg font-medium">{t('ranking.rankingRules')}</h3>
            <RankingConfig
              config={rankingConfig}
              onConfigChange={handleConfigChange}
              disabled={isExecuting}
            />
          </div>

          {/* 执行按钮 */}
          <div className="flex justify-center">
            <RankingExecutor
              config={rankingConfig}
              disabled={!isConfigValid || isExecuting}
              onExecuteStart={handleExecuteStart}
              onExecuteComplete={handleExecuteComplete}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}