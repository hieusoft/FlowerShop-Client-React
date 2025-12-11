import { Coupon } from "@/models/coupon";
import { getApiInstance } from "../api";
import { Manager } from "../manager";

const validateCoupon = (couponCode: string, totalPrice: number) => {
  return getApiInstance().post("/coupons/validate", {
    coupon_code: couponCode,
    total_price: totalPrice,
  });
};

const list = async () => {
    return getApiInstance().get("/coupons");
};

const fromId = async(id: number | string) => {
   return getApiInstance().get(`/coupons/${id}`);
}

const post = async(item: Coupon) => {
   return getApiInstance().post(`/coupons/`, item);
}

const put = async(item: Coupon) => {
   return getApiInstance().put(`/coupons/${item.id}`, item);
}

const deleteOne = async(id: number | string) => {
   return getApiInstance().delete(`/coupons/${id}`);
}

export default {
    list,
    fromId,
    post,
    put,
    delete: deleteOne,
    validateCoupon
};

export class CouponManager extends Manager<Coupon, null> {
    async list(): Promise<Coupon[]> {
        const x = await list();
        return x.data.coupons;
    }
    async post(item: Coupon): Promise<void> {
        await post(item);
    }
    async put(item: Coupon): Promise<void> {
        await put(item);
    }
    async delete(id: number | string): Promise<void> {
        await deleteOne(id);
    }
}