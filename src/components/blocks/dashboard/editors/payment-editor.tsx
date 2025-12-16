
import { Payment } from "@/models/payment";
import { Editor, EditorWrapper } from "./editor";
import { useObjectState } from "@/hooks/use-object-state";
import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { FieldGroup, FieldSet, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";

export const PaymentEditor: Editor<Payment> = ({ manager, item, onClose }) => {
    const [isBusy, setIsBusy] = useState(false);
    const isNew = !item || item.payment_id == null;

    const isDisabled = isBusy;

    const formState = useObjectState<Payment>(
        item || {
            payment_id: 0,
            order_id: 0,
            user_id: 0,
            provider: "",
            provider_order_id: "",
            amount: 0,
            currency: "",
            converted_amount: 0,
            status: "",
            expires_at: ""
        }
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        formState.set[name as keyof typeof formState.set]!(value as never);
    };

    function handleDelete() {
        setIsBusy(true);
        manager.delete(item?.payment_id as number).then(() => {
            toast.success("Deleted user successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    function handleSubmit() {
        setIsBusy(true);
        manager[isNew ? "post" : "put"](formState).then(() => {
            toast.success("Submitted user successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    return (
        <EditorWrapper
            header="Payment"
            isNew={isNew}
            onCancel={onClose}
            onDelete={!isNew ? handleDelete : undefined}
            onSubmit={handleSubmit}
        >
            <FieldGroup>
                <FieldSet>
                    <Field>
                        <FieldLabel>Order ID</FieldLabel>
                        <Input
                            name="order_id"
                            type="number"
                            value={formState.order_id}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>User ID</FieldLabel>
                        <Input
                            name="user_id"
                            type="number"
                            value={formState.user_id}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Provider</FieldLabel>
                        <Input
                            name="provider"
                            value={formState.provider}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Provider Order ID</FieldLabel>
                        <Input
                            name="provider_order_id"
                            value={formState.provider_order_id}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Amount</FieldLabel>
                        <Input
                            name="amount"
                            type="number"
                            value={formState.amount}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Currency</FieldLabel>
                        <Input
                            name="currency"
                            value={formState.currency}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>

    
                    <Field>
                        <FieldLabel>Converted Amount</FieldLabel>
                        <Input
                            name="converted_amount"
                            type="number"
                            value={formState.converted_amount}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Status</FieldLabel>
                        <Input
                            name="status"
                            value={formState.status}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Expires At</FieldLabel>

                        <div className="flex gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        {formState.expires_at
                                            ? format(
                                                new Date(formState.expires_at),
                                                "yyyy-MM-dd"
                                            )
                                            : "Pick date"}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="p-0">
                                    <Calendar
                                        mode="single"
                                        selected={
                                            formState.expires_at
                                                ? new Date(formState.expires_at)
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            if (!date) return;

                                            const time = formState.expires_at
                                                ? format(new Date(formState.expires_at), "HH:mm:ss")
                                                : "00:00:00";

                                            const sql = format(date, "yyyy-MM-dd") + " " + time;
                                            formState.set.expires_at(sql as never);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>

                            <Input
                                type="time"
                                value={
                                    formState.expires_at
                                        ? format(new Date(formState.expires_at), "HH:mm")
                                        : "00:00"
                                }
                                onChange={(e) => {
                                    const date = formState.expires_at
                                        ? format(new Date(formState.expires_at), "yyyy-MM-dd")
                                        : format(new Date(), "yyyy-MM-dd");

                                    const sql = `${date} ${e.target.value}:00`;
                                    formState.set.expires_at(sql as never);
                                }}
                                disabled={isDisabled}
                            />
                        </div>
                    </Field>
                </FieldSet>
            </FieldGroup>
        </EditorWrapper>
    );

}