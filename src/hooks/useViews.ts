import { useQuery } from '@tanstack/react-query';
import * as openApi from '@teable/openapi';
import { useGlobalUrlParams } from './useGlobalUrlParams';
import { IView } from '../types';

export function useViews() {
  const { tableId } = useGlobalUrlParams();

  return useQuery({
    queryKey: ['views', tableId],
    queryFn: async () => {
      if (!tableId) return [];
      const result = await openApi.getViewList(tableId);
      return (result.data || []) as IView[];
    },
    enabled: !!tableId,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    cacheTime: 10 * 60 * 1000, // 10分钟缓存
    retry: 2,
  });
}