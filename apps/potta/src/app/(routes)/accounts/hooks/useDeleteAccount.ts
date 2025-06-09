import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '../utils/api';

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-account'],
    mutationFn: (account_id: string) => accountsApi.delete(account_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-accounts'] });
    },
  });
};
