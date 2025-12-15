import { Occasion } from "@/models/occasion";
import {  getApiInstance } from "../api";

const list = async () => {
    return getApiInstance().get<Occasion[]>("/occasions");
}

const fromId = async(id: number | string) => {
   return getApiInstance().get(`/occasions/${id}`);
}

export default {
    list,
    fromId
};
