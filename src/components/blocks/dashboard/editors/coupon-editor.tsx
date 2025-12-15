import { Bouquet } from "@/models/bouquet"
import { Editor, EditorWrapper } from "./editor"
import { useObjectState } from "@/hooks/use-object-state"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Coupon } from "@/models/coupon"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { DateTimePicker } from "../items/date-time-picker"

export const CouponEditor: Editor<Coupon> = ({ manager, item, onClose }) => {

    const [isBusy, setIsBusy] = useState(false);
    const isNew = !item;
    const isDisabled = isBusy;

    const formState = useObjectState<Coupon>(item || {
        id: 0,
        code: "",
        discount_type: "percent",
        discount_value: 0,
        max_uses: 0,
        expiry_date: "",
        occasion: "",
        min_price: 0,
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
            toast.success("Deleted coupon successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    function handleSubmit() {
        setIsBusy(true);
        manager[isNew ? "post" : "put"](formState).then(() => {
            toast.success("Submitted coupon successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    return (
        <EditorWrapper 
            header="Coupon"
            isNew={isNew} 
            onCancel={onClose} onDelete={handleDelete} onSubmit={handleSubmit}
        >
            <FieldGroup>
                <FieldSet>
                    <Field>
                        <FieldLabel className="m-0">Code</FieldLabel>
                        <Input
                            name="code"
                            value={formState.code}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                    <div className="grid md:grid-cols-2 gap-5">
                        <Field>
                            <FieldLabel className="m-0">Discount</FieldLabel>
                            <div className="flex gap-2">
                                <Input
                                    name="discount_value" type="number"
                                    value={formState.discount_value}
                                    onChange={handleInputChange}
                                    disabled={isDisabled}
                                />
                                <Select value={formState.discount_type} onValueChange={formState.set.discount_type} disabled={isDisabled}>
                                    <SelectTrigger> 
                                        <SelectValue placeholder="..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="percent">%</SelectItem>
                                            <SelectItem value="vnd">$</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel className="m-0">Minimum price</FieldLabel>
                            <div className="flex gap-2">
                                <Input
                                    name="min_price" type="number"
                                    value={formState.min_price}
                                    onChange={handleInputChange}
                                    disabled={isDisabled}
                                />
                            </div>
                        </Field>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <Field>
                            <FieldLabel className="m-0">Uses left</FieldLabel>
                            <Input
                                name="max_uses" type="number"
                                value={formState.max_uses}
                                onChange={handleInputChange}
                                disabled={isDisabled}
                            />
                        </Field>
                        <Field>
                            <FieldLabel className="m-0">Expires at</FieldLabel>
                            <DateTimePicker 
                                value={new Date(formState.expiry_date)} 
                                onValueChange={(e) => formState.set.expiry_date(e.toISOString())}
                                disabled={isDisabled} />
                        </Field>
                    </div>
                </FieldSet>
            </FieldGroup>
        </EditorWrapper>
    )
}