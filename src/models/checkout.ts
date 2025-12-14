import { CartItemFlower } from "./cart";

export interface CheckoutFormData {
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
  deliveryTime: string;
  tax: number;
  fee: number;
  cartItems: CartItemFlower[];
  couponCode: string | null;
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
