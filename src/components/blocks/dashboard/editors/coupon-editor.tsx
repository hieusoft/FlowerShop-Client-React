import { Editor, EditorWrapper } from "./editor";
import { useObjectState } from "@/hooks/use-object-state";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Coupon } from "@/models/coupon";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { DateTimePicker } from "../items/date-time-picker";

export const CouponEditor: Editor<Coupon> = ({ manager, item, onClose }) => {
  const [isBusy, setIsBusy] = useState(false);
  const isNew = !item;
  const isDisabled = isBusy;

  const formState = useObjectState<Coupon>(item || {
    id: 0,
    code: "",
    discountType: "percent",
    discountValue: 0,
    maxUses: 0,
    expiryDate: "",
    occasion: "",
    minPrice: 0,
    created_at: "",
    updated_at: "",
  });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        formState.set[name as keyof typeof formState.set]!(value as never);
    };

  const handleDelete = () => {
    if (!item) return;
    setIsBusy(true);
    manager.delete(item.id)
      .then(() => {
        toast.success("Deleted coupon successfully");
        onClose?.(true);
      })
      .catch((e: AxiosError) => {
        setIsBusy(false);
        toast.error(e.response?.data?.message || "Delete failed");
      });
  };

  const handleSubmit = () => {
    setIsBusy(true);
    manager[isNew ? "post" : "put"](formState)
      .then(() => {
        toast.success("Submitted coupon successfully");
        onClose?.(true);
      })
      .catch((e: AxiosError) => {
        setIsBusy(false);
        toast.error(e.response?.data?.message || "Submit failed");
      });
  };

  return (
    <EditorWrapper
      header="Coupon"
      isNew={isNew}
      onCancel={onClose}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
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
                  name="discountValue"
                  type="number"
                  value={formState.discountValue}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                />
                <Select
                  value={formState.discountType}
                  onValueChange={(value) => formState.set.discountType(value)}
                  disabled={isDisabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="percent">%</SelectItem>
                      <SelectItem value="amount">$</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </Field>

            <Field>
              <FieldLabel className="m-0">Minimum price</FieldLabel>
              <Input
                name="minPrice"
                type="number"
                value={formState.minPrice}
                onChange={handleInputChange}
                disabled={isDisabled}
              />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Field>
              <FieldLabel className="m-0">Uses left</FieldLabel>
              <Input
                name="maxUses"
                type="number"
                value={formState.maxUses}
                onChange={handleInputChange}
                disabled={isDisabled}
              />
            </Field>

            <Field>
              <FieldLabel className="m-0">Expires at</FieldLabel>
              <DateTimePicker
                value={formState.expiryDate ? new Date(formState.expiryDate) : new Date()}
                onValueChange={(date) => formState.set.expiryDate(date.toISOString())}
                disabled={isDisabled}
              />
            </Field>
          </div>
        </FieldSet>
      </FieldGroup>
    </EditorWrapper>
  );
};
