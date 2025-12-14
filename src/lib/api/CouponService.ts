import { getApiInstance } from "../api";

const validateCoupon = (couponCode: string, totalPrice: number ,user_id :number) => {
  return getApiInstance().post("/coupons/validate", {
    coupon_code: couponCode,
    total_price: totalPrice,
    user_id:user_id
  });
};

export default {
  validateCoupon,
};