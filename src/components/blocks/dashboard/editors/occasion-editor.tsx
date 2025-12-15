import { Bouquet } from "@/models/bouquet"
import { Editor, EditorWrapper } from "./editor"
import { useObjectState } from "@/hooks/use-object-state"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Occasion, SubOccasion } from "@/models/occasion"
import { SubOccasionPicker } from "../items/sub-occasion-picker"
import { ImageListEditor } from "../items/image-list-editor"
import { OccasionPicker } from "../items/occasion-picker"
import { toast } from "sonner"
import { AxiosError } from "axios"

export const OccasionEditor: Editor<Occasion> = ({ manager, item, onClose }) => {

    const [isBusy, setIsBusy] = useState(false);
    const isNew = !item;
    const isDisabled = isBusy;

    const formState = useObjectState<Occasion>(item || {
        id: "",
        name: "",
        description: "",
        subOccasions: [],
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        formState.set[name as keyof typeof formState.set](value as never);
    };

    function handleDelete() {
        setIsBusy(true);
        manager.delete(item?.id as string).then(() => {
            toast.success("Deleted occasion category successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    function handleSubmit() {
        setIsBusy(true);
        manager[isNew ? "post" : "put"](formState).then(() => {
            toast.success("Submitted occasion category successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    return (
        <EditorWrapper 
            header="Occasion category"
            isNew={isNew} 
            onCancel={onClose} onDelete={handleDelete} onSubmit={handleSubmit}
        >
            <FieldGroup>
                <FieldSet>
                    <Field>
                        <FieldLabel className="m-0">Name</FieldLabel>
                        <Input
                            name="name"
                            value={formState.name}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                    <Field>
                        <FieldLabel className="m-0">Description</FieldLabel>
                        <Textarea
                            name="description"
                            value={formState.description}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                </FieldSet>
            </FieldGroup>
        </EditorWrapper>
    )
}