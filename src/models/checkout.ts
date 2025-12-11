export interface CheckoutFormData {
  email: string;
  phone: string;
  fullName: string;
  address: string;
  province: string;
  ward: string;
  note: string;
  shippingMethod: string;
  paymentMethod: string;
  useShippingAddress: boolean;
  saveInfo: boolean;
  acceptTerms: boolean;
  isNew: boolean;
  giftMessage: string;
}

export interface CheckoutState {
  step: number;
  isProcessing: boolean;
  orderComplete: boolean;
  orderNumber: string;
  couponCode: string;
  couponApplied: boolean;
  couponError: string;
}