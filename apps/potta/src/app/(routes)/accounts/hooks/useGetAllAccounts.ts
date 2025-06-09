import { useQuery } from '@tanstack/react-query';
import { Filters } from '../../pos/sales/utils/types';
import { accountsApi } from '../utils/api';

export const useGetAllAccounts = (filter: Filters) => {
  return useQuery({
    queryKey: ['get-all-accounts', filter.page, filter.limit],
    queryFn: () => accountsApi.getAll(filter),
  });
};
