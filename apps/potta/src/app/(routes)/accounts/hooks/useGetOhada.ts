import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '../utils/api';

export const useGetOhada = (name: string) => {
  return useQuery({
    queryKey: ['get-ohada', name],
    queryFn: () => accountsApi.getOhada(name),
  });
};
