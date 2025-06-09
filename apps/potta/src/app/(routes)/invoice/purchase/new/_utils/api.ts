import axios from '@/config/axios.config';
import { PurchaseOrderData } from './types';

export const purchaseOrderApi = {
  create: async (data: PurchaseOrderData) => {
    const response = await axios.post(`/purchase-orders`, data);
    return response.data;
  },
};
