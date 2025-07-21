import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 5 * 60_000, // обновляем каждые 5 минут
      staleTime: 5 * 60_000, // данные считаем свежими 5 минут
      cacheTime: 10 * 60_000, // храним кэш 10 минут
    },
  },
});
