import { Bouquet } from "@/models/bouquet"
import { Editor, EditorWrapper } from "./editor"
import { useObjectState } from "@/hooks/use-object-state"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { SubOccasion } from "@/models/occasion"
import { SubOccasionPicker } from "../items/sub-occasion-picker"
import { ImageListEditor } from "../items/image-list-editor"
import { toast } from "sonner"
import { AxiosError } from "axios"

export const BouquetEditor: Editor<Bouquet> = ({ manager, item, onClose }) => {

    if (item && typeof item?.subOccasionId == "object") {
        item.subOccasionId = (item.subOccasionId as unknown as SubOccasion)._id!;
    }

    const [isBusy, setIsBusy] = useState(false);
    const isNew = !item;
    const isDisabled = isBusy;

    const formState = useObjectState<Bouquet>(item || {
        id: "",
        name: "",
        description: "",
        price: 0,
        subOccasionId: "",
        images: [] as string[],
        createdAt: "",
        updatedAt: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        formState.set[name as keyof typeof formState.set](value as never);
    };

    function handleDelete() {
        setIsBusy(true);
        manager.delete(item?.id as string).then(() => {
            toast.success("Deleted bouquet successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    function handleSubmit() {
        setIsBusy(true);
        manager[isNew ? "post" : "put"](formState).then(() => {
            toast.success("Submitted bouquet successfully");
            onClose?.(true);
        }).catch((e: AxiosError) => {
            setIsBusy(false);
            toast.error(e.response?.data?.message);
        })
    }

    return (
        <EditorWrapper 
            header="Bouquet"
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
                    <div className="grid md:grid-cols-2 gap-5">
                        <Field>
                            <FieldLabel className="m-0">Price</FieldLabel>
                            <Input
                                name="price" type="number"
                                value={formState.price}
                                onChange={handleInputChange}
                                disabled={isDisabled}
                            />
                        </Field>
                        <Field>
                            <FieldLabel className="m-0">Occasion</FieldLabel>
                            <SubOccasionPicker
                                name="subOccasionId"
                                value={formState.subOccasionId}
                                onValueChange={formState.set.subOccasionId}
                                disabled={isDisabled}
                            />
                        </Field>
                    </div>
                    <Field>
                        <FieldLabel className="m-0">Images</FieldLabel>
                        <ImageListEditor items={formState.images} onItemsChange={formState.set.images} />
                    </Field>
                </FieldSet>
            </FieldGroup>
        </EditorWrapper>
    )
}