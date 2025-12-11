import { Input } from "@/components/ui/input"
import { API_ROOT } from "@/lib/api";
import { PlusIcon } from "lucide-react";

export function ImageListEditor(
    { items, onItemsChange }: {
        items: string[],
        onItemsChange: (items: string[]) => void
    }
) {

    function handleItemChange(index: number, value: string) {
        const newItems = new Array(Math.max(items.length, index + 1));
        for (let i = 0; i < newItems.length; i++) {
            newItems[i] = index == i ? value : items[i];
        }
        onItemsChange(newItems.filter(x => x));
    }

    return <div className="flex flex-col gap-2">
        {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-stretch">
                <div className="relative aspect-video overflow-hidden border rounded-md">
                    <img className="absolute inset-0 object-cover object-center" src={("/api/" + item)} alt="" />
                </div>
                <Input 
                    className="flex-1"
                    value={item} onChange={(e) => handleItemChange(index, e.target.value)} />
            </div>
        ))}
        <div key={items.length} className="flex gap-2 items-stretch">
            <div className="aspect-video border border-border/50 rounded-md flex items-center justify-center">
                <PlusIcon className="size-4" />
            </div>
            <Input 
                className="flex-1"
                placeholder="New image..."
                onChange={(e) => handleItemChange(items.length, e.target.value)} />
        </div>
    </div>
}