import { User, UserMn } from "@/models/user";
import { Editor, EditorWrapper } from "./editor";
import { useObjectState } from "@/hooks/use-object-state";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

export const Roles = [
    { value: "User" },
    { value: "Admin" },
    { value: "Manager" },
    { value: "Shipper" },
]

export const UserEditor: Editor<UserMn> = ({ manager, item, onClose }) => {
    const [isBusy, setIsBusy] = useState(false);
    const isNew = !item || item.userId == null;

    const isDisabled = isBusy;

    const formState = useObjectState<UserMn>(
        item || {
            userId: 0,
            fullName: "",
            userName: "",
            email: "",
            emailVerified: "",
            isBanned: false,
            roles: [],
        }
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        formState.set[name as keyof typeof formState.set]!(value as never);
    };

    function handleDelete() {
        setIsBusy(true);
        manager.delete(item?.userId as number).then(() => {
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
            header="User"
            isNew={isNew}
            onCancel={onClose}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
        >
            <FieldGroup>
                <FieldSet>
                    <div className="grid md:grid-cols-2 gap-5">
                        <Field>
                            <FieldLabel className="m-0">User name</FieldLabel>
                            <Input
                                name="userName"
                                value={formState.userName}
                                onChange={handleInputChange}
                                disabled={isDisabled}
                            />
                        </Field>
                        <Field>
                            <FieldLabel className="m-0">Display name</FieldLabel>
                            <Input
                                name="fullName"
                                value={formState.fullName}
                                onChange={handleInputChange}
                                disabled={isDisabled}
                            />
                        </Field>
                    </div>
                    <Field>
                        <FieldLabel className="m-0">Email</FieldLabel>
                        <Input
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                    <div className="grid md:grid-cols-2 gap-5">
                        <Field>
                            <FieldLabel className="m-0">Status</FieldLabel>
                            <Field orientation="horizontal">
                                <Checkbox
                                    name="isBanned"
                                    checked={formState.isBanned}
                                    onCheckedChange={formState.set.isBanned}
                                    disabled={isDisabled}
                                    id="user-is-banned"
                                />
                                <Label htmlFor="user-is-banned">
                                    Is banned
                                </Label>
                            </Field>
                        </Field>
                        <Field>
                            <FieldLabel className="m-0">Roles</FieldLabel>
                            <MultiSelect value={formState.roles} onValueChange={formState.set.roles} options={Roles} />
                        </Field>
                    </div>
                </FieldSet>
            </FieldGroup>
        </EditorWrapper>
    );
};