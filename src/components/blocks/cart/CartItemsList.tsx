import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CartItem from "./CartItem";
import { CartItemFlower } from "../../../models/cart";

interface CartItemsListProps {
  items: CartItemFlower[];
  selectedItems: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onRemoveSelected: () => void;
  onSaveForLater: (id: string) => void;
}

export default function CartItemsList({
  items,
  selectedItems,
  onSelectAll,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
  onRemoveSelected,
  onSaveForLater,
}: CartItemsListProps) {
  const allSelected = items.length > 0 && selectedItems.length === items.length;

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Selection Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Checkbox
            id="select-all"
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll(checked as boolean)}
            className="h-5 w-5"
          />
          <Label htmlFor="select-all" className="font-medium cursor-pointer">
            Select All ({selectedItems.length}/{items.length})
          </Label>
        </div>

        {selectedItems.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-black hover:text-black hover:bg-gray-100"
              >
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the selected items from your
                  cart? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onRemoveSelected}>
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            selected={selectedItems.includes(item.id)}
            onSelect={onSelectItem}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemoveItem}
            onSaveForLater={onSaveForLater}
          />
        ))}
      </div>
    </div>
  );
}
