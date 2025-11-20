import { useQuery } from '@tanstack/react-query';
import * as openApi from '@teable/openapi';
import { useGlobalUrlParams } from './useGlobalUrlParams';
import type { IField } from '../types';

/**
 * Centralized hook for fetching and caching field data from Teable tables.
 * Provides a unified interface for field data retrieval with built-in caching
 * and error handling.
 *
 * Features:
 * - Automatic caching with 5-minute stale time
 * - 10-minute cache time for optimal performance
 * - Error handling with fallback to empty array
 * - Disabled state when no table ID is available
 *
 * @returns {UseQueryResult<IField[], Error>} React Query result with field data
 */
export function useFields() {
  const urlParams = useGlobalUrlParams();

  return useQuery({
    queryKey: ['fields', urlParams.tableId],
    queryFn: async () => {
      if (!urlParams.tableId) {
        return [];
      }
      try {
        const result = await openApi.getFields(urlParams.tableId);
        return (result.data || []) as IField[];
      } catch (error) {
        console.error('Failed to fetch fields:', error);
        return [];
      }
    },
    enabled: !!urlParams.tableId,
    staleTime: 5 * 60 * 1000, // 5分钟
    cacheTime: 10 * 60 * 1000, // 10分钟
  });
}

