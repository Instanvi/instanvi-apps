import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '../utils/api';

export const useSearchOhada = (name: string, code: string | number) => {
  return useQuery({
    queryKey: ['search-ohada', name, code],
    queryFn: () => accountsApi.SearchOhada(name, code),
  });
};
