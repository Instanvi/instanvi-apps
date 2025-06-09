import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IAccountUpdatePayload } from '../utils/validations';
import { accountsApi } from '../utils/api';

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-account'],
    mutationFn: ({
      data,
      account_id,
    }: {
      account_id: string;
      data: IAccountUpdatePayload;
    }) => accountsApi.update(account_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-accounts'] });
    },
  });
};
