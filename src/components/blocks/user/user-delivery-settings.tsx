import { GlobalContext, useUser } from "@/components/providers/contexts/global-context";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ObjectState, useObjectState } from "@/hooks/use-object-state";
import { User } from "@/models/user";
import { FormEvent, useContext, useEffect, useState } from "react";
import RecipientService from "@/lib/api/RecipientService";
import { Recipient } from "@/models/recipient";
import { toast } from "sonner";
import UserService from "@/lib/api/UserService";
import AuthService from "@/lib/api/AuthService";
import { AxiosError } from "axios";
import { Select, SelectGroup, SelectContent, SelectTrigger, SelectValue, SelectItem, SelectLabel, SelectSeparator } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProvincePicker, WardPicker } from "../editors/province-ward-picker";

export function UserDeliverySettings() {
    const { user } = useUser();
    const [isInit, setIsInit] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [recipientIndex, setRecipientIndex] = useState(-1);

    function handleDataLoad() {
        setIsInit(true);
        setIsBusy(true);
        RecipientService.fromUser().then(({data}) => {
            setRecipients(data);
            if (recipientIndex < 0) for (let i = 0; i < data.length; i++) if (data[i].isDefault) {
                setRecipientIndex(i);
                break;
            }
            setIsBusy(false);
        })
    }
    
    useEffect(() => {
        if (user && !isInit) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            handleDataLoad();
        }
    }, [user, isInit])


    return (
        <div className="text-sm *:mb-12 *:*:mb-6 *:*:*:mb-3">
            <section>
                <h3 className="text-3xl font-heading leading-none">Delivery details</h3>
                <p>
                    <Label>Select recipient:</Label>
                    <Select
                        value={recipientIndex.toString()} onValueChange={(val) => setRecipientIndex(+val)}
                        disabled={isBusy}
                    >
                        <SelectTrigger className="w-full items-center *:first:*:*:not-first:hidden">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {recipients.map((rec, index) => (
                                    <SelectItem key={index} value={index.toString()}>
                                        <div className="flex flex-col">
                                            <span className="flex gap-1 items-center">
                                                {rec.fullName}
                                                {rec.isDefault && <Badge variant="secondary">Default</Badge>}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {rec.addressLine} - {rec.province} - {rec.ward}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                            <SelectSeparator/>
                            <SelectGroup>
                                <SelectItem value={recipients.length.toString()}>
                                    Create new recipient...
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </p>
                <UserRecipientForm 
                    user={user} recipient={recipients[recipientIndex]} 
                    disabled={isBusy} 
                    onSubmit={handleDataLoad} />
            </section>
        </div>
    );
}

export function UserRecipientForm(
    { user, recipient, disabled, onSubmit } : {
        user: User | undefined | null
        recipient?: Recipient,
        disabled?: boolean,
        onSubmit?: () => void
    }
) {

    const defaultRecipient = {
        recipientId: 0,
        userId: user?.userId,
        fullName: "",
        addressLine: "",
        province: "",
        ward: "",
        phoneNumber: "",
        isDefault: true
    }

    const formState = useObjectState(defaultRecipient) as ObjectState<Recipient>;
    const [isBusy, setIsBusy] = useState(!user);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const isNew = !recipient;
    const isDisabled = disabled || isBusy || !user;
    const [provinceCode, setProvinceCode] = useState(-1);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        formState.set[name as keyof typeof formState.set](value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsBusy(true);
        RecipientService[isNew ? "post" : "put"](formState).then(() => {
            toast.success("Recipient updated successfully");
            onSubmit?.();
        }).catch((e) => {
            toast.error(e.response?.data?.message ?? "Something went wrong")
        }).finally(() => {
            setIsBusy(false);
        })
    };

    const handleDelete = (e: React.FormEvent) => {
        setIsDeleteOpen(false);
        setIsBusy(true);
        RecipientService.delete(recipient!.recipientId).then(() => {
            toast.success("Recipient deleted successfully");
            onSubmit?.();
        }).catch((e) => {
            toast.error(e.response?.data?.message ?? "Something went wrong")
        }).finally(() => {
            setIsBusy(false);
        })
    };

    useEffect(() => {
        const recipientData = recipient || defaultRecipient
        for (const id in formState.set) {
            formState.set[id as keyof typeof formState.set](recipientData[id as keyof typeof formState.set] as never);
        }
    }, [recipient])

    return <>
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete recipient</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this recipient?</p>
                <DialogFooter>
                    <Button variant="secondary" type="button" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                    <Button variant="destructive" type="button" onClick={handleDelete}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <div className="grid md:grid-cols-2 gap-5">
                    <FieldSet>
                        <Field>
                            <FieldLabel className="m-0">Recipient&apos;s full name</FieldLabel>
                            <Input
                                name="fullName"
                                required
                                value={formState.fullName}
                                onChange={handleInputChange}
                                disabled={isDisabled}
                            />
                        </Field>
                    </FieldSet>
                    <FieldSet>
                        <Field>
                            <FieldLabel className="m-0">Phone number</FieldLabel>
                            <Input
                                name="phoneNumber"
                                required
                                value={formState.phoneNumber}
                                onChange={handleInputChange}
                                disabled={isDisabled}
                            />
                        </Field>
                    </FieldSet>
                </div>
                <FieldSet>
                    <Field>
                        <FieldLabel className="m-0">Address line</FieldLabel>
                        <Input
                            name="addressLine"
                            required
                            value={formState.addressLine}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                </FieldSet>
                <div className="grid md:grid-cols-2 gap-5">
                    <FieldSet>
                        <Field>
                            <FieldLabel className="m-0">Province</FieldLabel>
                            <ProvincePicker value={formState.province} onValueChange={formState.set.province}
                                onCodeChange={setProvinceCode} disabled={isDisabled} />
                        </Field>
                    </FieldSet>
                    <FieldSet>
                        <Field>
                            <FieldLabel className="m-0">Ward</FieldLabel>
                            <WardPicker value={formState.ward} onValueChange={formState.set.ward}
                                provinceCode={provinceCode} disabled={isDisabled} />
                        </Field>
                    </FieldSet>
                </div>
                <FieldSet>
                    <div className="flex flex-col lg:flex-row gap-2">
                        <Field orientation="horizontal">
                            <Checkbox 
                                id="recipient-default-checkbox"
                                checked={formState.isDefault} onCheckedChange={formState.set.isDefault}
                                disabled={recipient?.isDefault || isDisabled}
                            ></Checkbox>
                            <FieldLabel htmlFor="recipient-default-checkbox">Use as default for future orders</FieldLabel>
                        </Field>
                        <span className="flex-1"></span>
                        {isNew || <Button 
                            type="button" variant="destructive" disabled={isDisabled}
                            onClick={() => setIsDeleteOpen(true)}>Delete recipient</Button>}
                        <Button type="submit" disabled={isDisabled}>Save changes</Button>
                    </div>
                </FieldSet>
            </FieldGroup>
        </form>
    </>;
}
