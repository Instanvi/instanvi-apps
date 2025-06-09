import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '../utils/api';

export const useGetOneAccount = (account_id: string) => {
  return useQuery({
    queryKey: ['get-one-account', account_id],
    queryFn: () => accountsApi.getOne(account_id),
  });
};
