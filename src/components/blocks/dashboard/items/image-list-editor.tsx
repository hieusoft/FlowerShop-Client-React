import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { API_ROOT } from "@/lib/api";
import { BouquetImageUpload } from "@/models/bouquet";
import { FileX, PlusIcon, UploadIcon } from "lucide-react";
import { ChangeEvent, DragEvent, useRef } from "react";

export function ImageListEditor(
    { items, onItemsChange }: {
        items: BouquetImageUpload[],
        onItemsChange: (items: BouquetImageUpload[]) => void
    }
) {

    const fileUploader = useRef<HTMLInputElement | null>(null);

    function handleItemAdd(values: BouquetImageUpload[]) {
        onItemsChange([...items, ...values]);
    }

    function getImagePath(value: BouquetImageUpload): string {
        if ("base64" in value) {
            return  value.base64;
        } else if ("url" in value) {
            return "/api/" + value.url;
        } else {
            return "";
        }
    }

    async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;
        for (const file of files) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                handleItemAdd([{ base64: reader.result as string }]);
            }
        }
    }

    async function handleFileDrag(e: DragEvent<HTMLButtonElement>) {
        e.preventDefault();
    }

    async function handleFileDrop(e: DragEvent<HTMLButtonElement>) {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (!files) return;
        const newItems: BouquetImageUpload[] = [];
        for (const file of files) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                handleItemAdd([{ base64: reader.result as string }]);
            }
        }
    }

    return <div className="grid auto-fill-20 gap-2">
        {items.map((item, index) => (
            <div key={index} className="relative aspect-square border overflow-hidden rounded-md">
                <img className="absolute inset-0 object-cover object-center" src={getImagePath(item)} alt="" />
            </div>
        ))}
        <div className="relative aspect-square">
            <Button 
                variant="outline" 
                className="absolute inset-0 h-full border border-dashed overflow-hidden rounded-md drag:bg-secondary/80"
                onClick={() => fileUploader.current?.click()}
                onDragOver={handleFileDrag}
                onDrop={handleFileDrop}
            >
                <div className="flex flex-col gap-1 text-xs max-w-full text-center items-center p-2 whitespace-pre-wrap">
                    <UploadIcon />
                    <span>Upload image...</span>
                </div>
            </Button>
            <input 
                type="file" className="hidden" multiple
                accept="image/png,image/jpeg"
                onChange={handleFileUpload}
                ref={fileUploader} />
        </div>
    </div>
}