'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/AuthContext';
import { queryClientInstance } from '@/lib/query-client';

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        {children}
      </QueryClientProvider>
    </AuthProvider>
  );
}
