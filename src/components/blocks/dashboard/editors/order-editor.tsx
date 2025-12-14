import { Bouquet } from "@/models/bouquet"
import { Editor, EditorWrapper } from "./editor"
import { useObjectState } from "@/hooks/use-object-state"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Order, OrderItem, SubOrder } from "@/models/order"
import { SubOrderPicker } from "../items/sub-order-picker"
import { ImageListEditor } from "../items/image-list-editor"
import { OrderPicker } from "../items/order-picker"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { Select, SelectGroup, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import OrderItemService from "@/lib/api/OrderItemService"
import { formatUnit, formatWhole } from "@/lib/utils"
import ProductService from "@/lib/api/ProductService"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export const OrderEditor: Editor<Order> = ({ manager, item, onClose }) => {

    const [isBusy, setIsBusy] = useState(false);
    const [items, setItems] = useState<OrderItem[]>([])
    const [bouquets, setBouquets] = useState<Record<string, Bouquet>>({})
    const [isItemBusy, setIsItemBusy] = useState(false);
    const isNew = !item;
    const isDisabled = isBusy;

    const subtotal = items.reduce((x, y) => x + y.price * y.quantity, 0);

    const formState = useObjectState<Order>(item || {
        order_id: 0,
        order_code: "",
        user_id: 0,
        total_price: 0,
        discount: 0,
        coupon_code: "",
        vat_amount: 0,
        shipping_fee: 0,
        message: "",
        status: "Pending",
        description: "",
        delivery_date: "",
        created_at: "",
        updated_at: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        formState.set[name as keyof typeof formState.set](value as never);
    };

    function handleDelete() {
        setIsBusy(true);
        manager.delete(item?.id as string).then(() => {
            toast.success("Deleted order successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    function handleSubmit() {
        setIsBusy(true);
        manager[isNew ? "post" : "put"](formState).then(() => {
            toast.success("Submitted order successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    useEffect(() => {
        if (formState.order_id) {
            OrderItemService.fromOrder(formState.order_id).then(({data}) => {
                setItems(data)
                for (const item of data) {
                    ProductService.fromId(item.bouquet_id).then(({data}) => {
                        setBouquets({ ...bouquets, [item.bouquet_id]: data })
                    })
                }
            })
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setItems([]);
        }
    }, [formState.order_id])

    return (
        <EditorWrapper 
            header="Order"
            isNew={isNew} 
            onCancel={onClose} onDelete={handleDelete} onSubmit={handleSubmit}
        >
            <FieldGroup>
                <div className="flex flex-col gap-2">
                    {items.map((item, index) => (
                        <div key={index}>
                            <b>
                                {bouquets[item.bouquet_id]?.name ?? (
                                    <Skeleton className="h-4 my-0.5 w-40"></Skeleton>
                                )}
                            </b>
                            <div className="flex gap-2 justify-end text-end">
                                <span className="block basis-24">{formatUnit(item.price, "currency/vnd")}</span>
                                <span className="block basis-[1ch]">&times;</span>
                                <span className="block basis-8">{formatWhole(item.quantity)}</span>
                                <span className="block basis-[1ch]">=</span>
                                <span className="block basis-24">{formatUnit(item.price * item.quantity, "currency/vnd")}</span>
                            </div>
                        </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between">
                        <b>Subtotal</b>
                        <span className="block basis-24 text-end">{formatUnit(subtotal, "currency/vnd")}</span>
                    </div>
                    <div className="flex justify-between">
                        <b>Delivery fee</b>
                        <span className="block basis-24 text-end">{formatUnit(formState.shipping_fee, "currency/vnd")}</span>
                    </div>
                    <div className="flex justify-between">
                        <b>VAT</b>
                        <span className="block basis-24 text-end">{formatUnit(formState.vat_amount, "currency/vnd")}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <b>Total</b>
                        <span className="block basis-24 text-end">{formatUnit(formState.total_price, "currency/vnd")}</span>
                    </div>
                </div>
                <FieldSet>
                    <Field>
                        <FieldLabel className="m-0">Payment status</FieldLabel>
                        <Select
                            value={formState.status}
                            onChange={formState.set.status}
                            disabled={isDisabled}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                </FieldSet>
            </FieldGroup>
        </EditorWrapper>
    )
}