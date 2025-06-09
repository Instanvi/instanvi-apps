import { accountsApi } from '../utils/api';
import { IAccountPayload } from '../utils/validations';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreatAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-account'],
    mutationFn: (data: IAccountPayload) => accountsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-accounts'] });
    },
  });
};
