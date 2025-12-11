import { Bouquet } from "@/models/bouquet"
import { Editor, EditorWrapper } from "./editor"
import { useObjectState } from "@/hooks/use-object-state"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Greeting, SubGreeting } from "@/models/greeting"
import { SubGreetingPicker } from "../items/sub-greeting-picker"
import { ImageListEditor } from "../items/image-list-editor"
import { GreetingPicker } from "../items/greeting-picker"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { OccasionPicker } from "../items/occasion-picker"
import { SubOccasionPicker } from "../items/sub-occasion-picker"

export const GreetingEditor: Editor<Greeting> = ({ manager, item, onClose }) => {

    const [isBusy, setIsBusy] = useState(false);
    const isNew = !item;
    const isDisabled = isBusy;

    const formState = useObjectState<Greeting>(item || {
        id: "",
        text: "",
        subOccasionId: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        formState.set[name as keyof typeof formState.set](value as never);
    };

    function handleDelete() {
        setIsBusy(true);
        manager.delete(item?.id as string).then(() => {
            toast.success("Deleted greeting successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    function handleSubmit() {
        setIsBusy(true);
        manager[isNew ? "post" : "put"](formState).then(() => {
            toast.success("Submitted greeting successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    return (
        <EditorWrapper 
            header="Greeting"
            isNew={isNew} 
            onCancel={onClose} onDelete={handleDelete} onSubmit={handleSubmit}
        >
            <FieldGroup>
                <FieldSet>
                    <Field>
                        <FieldLabel className="m-0">Text</FieldLabel>
                        <Textarea
                            name="text"
                            value={formState.text}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                    <Field>
                        <FieldLabel className="m-0">Category</FieldLabel>
                        <SubOccasionPicker
                            name="occasionId"
                            value={formState.subOccasionId}
                            onValueChange={formState.set.subOccasionId}
                            disabled={isDisabled}
                        />
                    </Field>
                </FieldSet>
            </FieldGroup>
        </EditorWrapper>
    )
}