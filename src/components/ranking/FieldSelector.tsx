'use client';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@teable/ui-lib/dist/shadcn/ui/select';
import { Label } from '@teable/ui-lib/dist/shadcn/ui/label';
import { useFields } from '../../hooks/useFields';
import { IRankingConfig, IField, IUIField } from '../../types';
import { Hash, Code, Search, Layers } from '@teable/icons';

interface IFieldSelectorProps {
  config: IRankingConfig;
  onConfigChange: (config: Partial<IRankingConfig>) => void;
  disabled?: boolean;
}

export function FieldSelector({ config, onConfigChange, disabled }: IFieldSelectorProps) {
  const { t } = useTranslation('common');

  // 使用集中式字段数据获取
  const { data: fields } = useFields();

  // 字段类型图标映射 - 基于字段属性而不是仅基于type
  const getFieldTypeIcon = (field: IField | IUIField) => {
    // 查找字段（包括普通查找和条件查找）使用Search图标
    if (field.isLookup || field.isConditionalLookup) {
      return Search;
    }
    // 汇总字段（包括普通汇总和条件汇总）使用Layers图标
    if (field.type === 'rollup' || field.type === 'conditionalRollup') {
      return Layers;
    }
    // 公式字段使用Code图标
    if (field.type === 'formula') {
      return Code;
    }
    // 数字字段使用Hash图标
    return Hash;
  };

  // 过滤出数字类型的字段作为源列选项（支持更多返回数字的字段类型）
  const numericFields = fields?.filter((field: IField) => {
    // 检查字段是否返回数字值
    const isNumericField = field.cellValueType === 'number';
    return isNumericField;
  }).map((field: IField): IUIField => {
    // 基于 lookupOptions.filter 准确识别字段类型
    const hasFilter = field.lookupOptions?.filter !== undefined;

    const uiField: IUIField = {
      id: field.id,
      name: field.name,
      type: field.type,
      isComputed: field.isComputed || false,
      cellValueType: field.cellValueType,
      // 添加字段详细信息用于UI展示
      isLookup: field.isLookup === true,
      isConditionalLookup: field.isConditionalLookup === true,
      isRollup: field.type === 'rollup' || field.type === 'conditionalRollup',
      isMultipleCellValue: field.isMultipleCellValue === true,
      // 新增：基于filter属性的字段类型判断
      isConditionalField: hasFilter,
    };

    // 只有当lookupOptions存在时才添加它
    if (field.lookupOptions) {
      uiField.lookupOptions = field.lookupOptions;
    }

    return uiField;
  });

  // 目标字段只支持纯数字字段（必须是用户可以手动输入的字段）
  const targetFields = fields?.filter((field: IField) => {
    // 排除已选择的源字段
    if (field.id === config.sourceColumnId) {
      return false;
    }

    // 检查是否为计算字段（无法手动写入的字段）
    const isComputedField = field.isComputed === true ||
                          field.type === 'formula' ||
                          field.isLookup === true ||
                          field.isConditionalLookup === true ||
                          field.type === 'rollup' ||
                          field.type === 'conditionalRollup' ||
                          field.isMultipleCellValue === true;

    // 只允许非计算字段的数字类型字段
    return field.cellValueType === 'number' && !isComputedField;
  }).map((field: IField) => ({
    id: field.id,
    name: field.name,
    type: field.type,
    isFormula: false,
    cellValueType: field.cellValueType,
  })) || [];

  const handleSourceColumnChange = (value: string) => {
    // 如果目标字段与新选择的源字段相同，清空目标字段
    if (config.targetColumnId === value) {
      onConfigChange({ sourceColumnId: value, targetColumnId: '' });
    } else {
      onConfigChange({ sourceColumnId: value });
    }
  };

  const handleTargetColumnChange = (value: string) => {
    onConfigChange({ targetColumnId: value });
  };

  // 获取当前选中的源字段，用于自定义显示
  const selectedSourceField = numericFields?.find(field => field.id === config.sourceColumnId);

  
  
  // 检查是否有错误状态
  const hasError = config.sourceColumnId === config.targetColumnId && config.sourceColumnId !== '';

  return (
    <div className="space-y-4">
      {hasError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            {t('ranking.sameFieldError', '源字段和目标字段不能相同')}
          </p>
        </div>
      )}

      
      <div className="space-y-2">
        <Label htmlFor="source-field">
          {t('ranking.selectSourceField', '选择用于计算排名的字段')}
        </Label>
        <Select
          value={config.sourceColumnId}
          onValueChange={handleSourceColumnChange}
          disabled={disabled || (numericFields?.length || 0) === 0}
        >
          <SelectTrigger id="source-field">
            <SelectValue
              placeholder={
                (numericFields?.length || 0) === 0
                  ? t('ranking.noNumericFields', '未找到数字字段')
                  : t('ranking.selectSourceFieldPlaceholder', '请选择字段')
              }
            >
              {selectedSourceField ? (
                <div className="flex items-center gap-2">
                  {(() => {
                    const IconComponent = getFieldTypeIcon(selectedSourceField);
                    return <IconComponent className="w-4 h-4 text-gray-500" />;
                  })()}
                  <span>{selectedSourceField.name}</span>
                </div>
              ) : null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(numericFields || []).map((field: IField) => {
              const IconComponent = getFieldTypeIcon(field);
              // 获取简化的字段类型描述
              const getFieldTypeDescription = (field: IField) => {
                if (field.isLookup || field.isConditionalLookup) {
                  return t('ranking.fieldType.lookup', '查找字段');
                }
                if (field.isRollup || field.type === 'rollup' || field.type === 'conditionalRollup') {
                  return t('ranking.fieldType.rollup', '汇总字段');
                }
                if (field.type === 'formula') {
                  return t('ranking.fieldType.formula', '公式字段');
                }
                return t('ranking.fieldType.number', '数字字段');
              };

              const fieldDescription = getFieldTypeDescription(field);
              const isArrayField = field.isLookup || field.isConditionalLookup || field.isRollup || field.isMultipleCellValue;

              return (
                <SelectItem key={field.id} value={field.id}>
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-gray-500" />
                    <div className="flex flex-col">
                      <span className="font-medium">{field.name}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{fieldDescription}</span>
                        {isArrayField && (
                          <span className="text-blue-600 bg-blue-50 px-1 rounded">
                            {t('ranking.arrayHint', '取首值')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="target-field">
          {t('ranking.selectTargetField', '排名结果将写入的字段')}
        </Label>
        <Select
          value={config.targetColumnId}
          onValueChange={handleTargetColumnChange}
          disabled={disabled || targetFields.length === 0}
        >
          <SelectTrigger id="target-field">
            <SelectValue
              placeholder={
                targetFields.length === 0
                  ? ((numericFields?.length || 0) === 1
                      ? t('ranking.onlyOneField', '只有一个数字字段，请先创建另一个数字字段用于存储排名结果')
                      : t('ranking.noFields', '未找到可用字段'))
                  : t('ranking.selectTargetFieldPlaceholder', '请选择字段')
              }
            />
          </SelectTrigger>
          <SelectContent>
            {targetFields.map((field: IField) => {
              const IconComponent = getFieldTypeIcon(field);
              return (
                <SelectItem key={field.id} value={field.id}>
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-gray-500" />
                    <span>{field.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}