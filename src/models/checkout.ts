export interface CheckoutFormData {
  email: string;
  phone: string;
  fullName: string;
  address: string;
  province: string;
  ward: string;
  note: string;
  paymentMethod: string;
  saveInfo: boolean;
  acceptTerms: boolean;
  isNew: boolean;
  giftMessage: string;
  deliveryDate: string;
  deliveryTime: string
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