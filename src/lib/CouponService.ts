import { apiInstance } from "./api";

const ValidateCoupon = (coupon_code: string, total_price: number) => {
  return apiInstance.post("/coupons/validate", {
    coupon_code,
    total_price,
  });
};

export default {
  ValidateCoupon,
};
