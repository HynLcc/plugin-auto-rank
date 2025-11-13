// 核心业务类型定义

/**
 * 排名配置接口
 */
export interface IRankingConfig {
  sourceColumnId: string;
  targetColumnId: string;
  sortDirection: 'asc' | 'desc';
  rankingMethod: 'standard' | 'dense';
  zeroValueHandling: 'skipZero' | 'includeZero';
  groupColumnId?: string; // 可选的分组字段ID
  viewId?: string; // 可选的视图ID，用于筛选数据范围
}

/**
 * 排名输入接口
 */
export interface IRankingInput {
  records: IRecordData[];
  sourceColumnId: string;
  sortDirection: 'asc' | 'desc';
  rankingMethod: 'standard' | 'dense';
  zeroValueHandling: 'skipZero' | 'includeZero';
}

/**
 * 分组排名输入接口
 */
export interface IGroupedRankingInput extends IRankingInput {
  groupColumnId?: string; // 可选的分组字段ID
}

/**
 * 排名结果接口
 */
export interface IRankingResult {
  recordId: string;
  rank: number;
}

/**
 * 分组排名结果接口
 */
export interface IGroupedRankingResult extends IRankingResult {
  groupValue?: string | number | boolean | null; // 分组值，支持常见字段类型
  groupName?: string; // 人类可读的分组名称
}

/**
 * 排名输出接口
 */
export interface IRankingOutput {
  results: IRankingResult[];
  processedCount: number;
  skippedCount: number;
}

/**
 * 分组排名输出接口
 */
export interface IGroupedRankingOutput {
  results: IGroupedRankingResult[];
  processedCount: number;
  skippedCount: number;
  groupCount: number; // 分组数量
}

/**
 * 记录数据接口
 */
export interface IRecordData {
  id: string;
  fields: Record<string, string | number | boolean | null | undefined>;
}

/**
 * 字段查找选项接口
 */
export interface IFieldLookupOptions {
  filter?: any;
  // 可以根据需要添加更多查找选项属性
}

/**
 * 扩展的字段类型接口，兼容Teable SDK
 */
export interface IField {
  id: string;
  name: string;
  type: string;
  cellValueType: string;
  isLookup?: boolean;
  isConditionalLookup?: boolean;
  isComputed?: boolean;
  isMultipleCellValue?: boolean;
  lookupOptions?: IFieldLookupOptions;
  // 其他可能的Teable字段属性
  options?: any;
  description?: string;
  // 向后兼容的属性
  isRollup?: boolean;
  isFormula?: boolean;
}

/**
 * UI字段信息接口，用于组件内部字段展示
 */
export interface IUIField {
  id: string;
  name: string;
  type: string;
  cellValueType: string;
  isComputed: boolean;
  isLookup: boolean;
  isConditionalLookup: boolean;
  isRollup: boolean;
  isMultipleCellValue: boolean;
  isConditionalField: boolean;
  lookupOptions?: IFieldLookupOptions;
  // 其他可选属性
  options?: any;
  description?: string;
}

/**
 * 字段选项接口
 */
export interface IFieldOption {
  id: string;
  name: string;
  type: string;
}

/**
 * 排名算法类型
 */
export type RankingMethod = 'standard' | 'dense';

/**
 * 排序方向类型
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 0值处理策略类型
 */
export type ZeroValueHandling = 'skipZero' | 'includeZero';

/**
 * 排名计算状态类型
 */
export type RankingStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * 错误类型
 */
export interface IAppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * 排名执行结果类型
 */
export interface IRankingExecutionResult {
  success: boolean;
  processedCount: number;
  failedCount: number;
  groupCount?: number;
  error?: IAppError;
}

/**
 * Toast 通知类型
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * 组件 Props 类型
 */
export interface IBaseComponentProps {
  disabled?: boolean;
  className?: string;
}

/**
 * 选择器组件 Props 类型
 */
export interface ISelectorProps<T = string> extends IBaseComponentProps {
  value?: T;
  onValueChange: (value: T) => void;
  placeholder?: string;
  options: Array<{
    value: T;
    label: string;
    disabled?: boolean;
  }>;
}

/**
 * URL 参数类型
 */
export interface IUrlParams {
  lang: 'en' | 'zh';
  baseId: string;
  pluginInstallId: string;
  positionId: string;
  positionType: string;
  pluginId: string;
  theme: 'light' | 'dark';
  tableId?: string; // 在实际使用中 tableId 是必需的
  viewId?: string;
  dashboardId?: string;
  recordId?: string;
  shareId?: string;
}

/**
 * API 响应基础类型
 */
export interface IApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * 分页参数类型
 */
export interface IPaginationParams {
  take?: number;
  skip?: number;
}

/**
 * 排序参数类型
 */
export interface ISortParams {
  fieldId: string;
  order: 'asc' | 'desc';
}

/**
 * 记录查询参数类型
 */
export interface IRecordQueryParams extends IPaginationParams {
  viewId?: string;
  orderBy?: ISortParams[];
  projection?: string[];
  fieldKeyType?: 'id' | 'name';
}

/**
 * 视图类型定义
 */
export interface IView {
  id: string;
  name: string;
  type: 'grid' | 'gallery' | 'kanban' | 'calendar' | 'form' | 'component';
  description?: string;
  order: number;
  shared?: boolean;
  icon?: string;
}