import { User, UserMn } from "@/models/user";
import { Editor, EditorWrapper } from "./editor";
import { useObjectState } from "@/hooks/use-object-state";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

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
                    <Field>
                        <FieldLabel className="m-0">Username</FieldLabel>
                        <Input
                            name="userName"
                            value={formState.userName}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                    <Field>
                        <FieldLabel className="m-0">Full name</FieldLabel>
                        <Input
                            name="fullName"
                            value={formState.fullName}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                </FieldSet>
            </FieldGroup>
        </EditorWrapper>
    );
};