import { Occasion } from "@/models/occasion";
import { clientApiInstance, getApiInstance } from "../api";

const list = async () => {
    return getApiInstance().get<Occasion[]>("/occasions");
}
export default {
    list,
};
