import { useMemo } from 'react';
import { useFields } from './useFields';

/**
 * 字段ID到名称映射的记忆化钩子
 * 避免重复计算字段映射
 */
export function useFieldMap() {
  const { data: fields } = useFields();

  return useMemo(() => {
    if (!fields) return {};

    return fields.reduce((map: Record<string, string>, field) => {
      map[field.id] = field.name;
      return map;
    }, {});
  }, [fields]);
}

