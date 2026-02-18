import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const ApiProvider = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools />
  </QueryClientProvider>
);
