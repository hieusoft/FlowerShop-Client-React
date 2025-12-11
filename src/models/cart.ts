export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
}
export interface CartItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
  maxQuantity: number;
  sku: string;
  category: string;
}
export interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviewCount: number;
  discount?: number;
}

export type CartItemFlower = {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image: string;  
  subOccasion?: {
    id: string;
    name: string;
    description?: string;
  };
};
 
export interface CartSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
}