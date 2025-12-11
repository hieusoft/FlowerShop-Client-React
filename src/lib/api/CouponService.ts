import { getApiInstance } from "../api";

const validateCoupon = (couponCode: string, totalPrice: number) => {
  return getApiInstance().post("/coupons/validate", {
    coupon_code: couponCode,
    total_price: totalPrice,
  });
};

export default {
  validateCoupon,
};