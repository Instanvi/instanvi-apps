export interface PurchaseOrderData {
  orderNumber: string;
  orderDate: string;
  requiredDate: string;
  shipDate: string;
  orderTotal: number;
  shoppingAddress: string;
  paymentTerms: string;
  paymentMethod: string;
  status: string;
  customerId: string;
  vendorId: string;
  notes: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    discountCap: number;
    discountType: string;
    unitPrice: number;
    taxRate: number;
    discountRate: number;
    productId: string;
  }>;
}
