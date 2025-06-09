import { purchaseOrderApi } from '../_utils/api';
import { useMutation } from '@tanstack/react-query';

export default function useCreatePurchaseOrder() {
  return useMutation({
    mutationKey: ['create-purchase-order'],
    mutationFn: purchaseOrderApi.create,
  });
}
