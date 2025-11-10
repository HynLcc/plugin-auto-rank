'use client';

import { getQueryClient } from '@/components/context/getQueryClient';
import { RankingPages } from '@/components/RankingPages';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@teable/next-themes';
import { IUIConfig, usePluginBridge } from '@teable/sdk';
import { useInitApi } from '@/hooks/useInitApi';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

/**
 * Main application component that sets up the plugin environment with theme support,
 * query client, error boundaries, and Teable plugin bridge integration.
 *
 * Responsibilities:
 * - Initialize and manage Teable plugin bridge communication
 * - Provide theme context with fallback support
 * - Set up React Query client for data fetching
 * - Configure error boundaries for error handling
 * - Initialize API communication with Teable
 *
 * @param {Object} props - Component props
 * @param {'light' | 'dark'} props.theme - Default theme for the application
 * @returns {JSX.Element} The configured main application component
 */
export default function Main({ theme }: { theme: 'light' | 'dark' }) {
  const pluginBridge = usePluginBridge();
  const queryClient = getQueryClient();
  const [uiConfig, setUIConfig] = useState<IUIConfig | undefined>();
  const isApiInit = useInitApi();

  /**
   * Effect hook to set up event listeners for Teable plugin bridge UI configuration changes.
   * Listens for theme and UI state changes from the Teable host environment.
   * Cleans up event listeners when component unmounts.
   */
  useEffect(() => {
    if (!pluginBridge) {
      return;
    }
    const uiConfigListener = (config: IUIConfig) => {
      setUIConfig(config);
    };
    pluginBridge.on('syncUIConfig', uiConfigListener);
    return () => {
      pluginBridge.removeListener('syncUIConfig', uiConfigListener);
    };
  }, [pluginBridge]);

  // Wait for API initialization to complete
  if (!isApiInit) {
    return <div>Loading...</div>;
  }

  /**
   * Error handler for the ErrorBoundary component.
   * Logs application errors for debugging purposes.
   * Can be extended to include error reporting services.
   *
   * @param {Error} error - The error that was thrown
   * @param {React.ErrorInfo} errorInfo - Additional error information from React
   */
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // TODO: Add error reporting service integration
    console.error('Application error:', error, errorInfo);
  };

  return (
    <ThemeProvider attribute="class" forcedTheme={uiConfig?.theme ?? theme}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary onError={handleError}>
          <RankingPages />
        </ErrorBoundary>
        <Toaster
          theme={(uiConfig?.theme as 'light' | 'dark' | 'system') ?? theme}
          position="bottom-left"
          expand={false}
          richColors
          closeButton
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
