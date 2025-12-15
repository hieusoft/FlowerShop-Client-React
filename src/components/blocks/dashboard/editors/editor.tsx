import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Manager } from "@/lib/manager";
import { ReactNode, useState } from "react";

export type Editor<T> = (args: EditorArgs<T>) => React.ReactNode;

export type EditorArgs<T> = { 
    manager: Manager<T, unknown>,
    item: T | null,
    onClose?: (update?: boolean) => void
}

export function EditorWrapper(
    { header, children, disabled, isNew, onCancel, onDelete, onSubmit }: {
        header?: string,
        children?: ReactNode,
        disabled?: boolean,
        isNew?: boolean
        onCancel?: () => void,
        onDelete?: () => void,
        onSubmit?: () => void,
    }
) {

    const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

    return <>
        <DialogHeader>
            <DialogTitle>{header}</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter>
            <Button 
                variant="secondary" disabled={disabled}
                onClick={() => onCancel?.()}
            >
                Cancel
            </Button>
            <span className="flex-1"></span>
            {!isNew && <Button 
                variant="destructive" disabled={disabled}
                onClick={() => setIsDeleteConfirming(true)}
            >
                Delete
            </Button>}
            <Button 
                disabled={disabled}
                onClick={() => onSubmit?.()}
            >
                {isNew ? "Create" : "Update"}
            </Button>
        </DialogFooter>
        <Dialog open={isDeleteConfirming} onOpenChange={setIsDeleteConfirming}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete {header}?</DialogTitle>
                </DialogHeader>
                <p>
                    Are you sure you want to delete this {header}?
                </p>
                <DialogFooter>
                    <Button 
                        variant="secondary" disabled={disabled}
                        onClick={() => setIsDeleteConfirming(false)}
                    >
                        Cancel
                    </Button>
                    <span className="flex-1"></span>
                    {!isNew && <Button 
                        variant="destructive" disabled={disabled}
                        onClick={() => { setIsDeleteConfirming(false); onDelete?.() }}
                    >
                        Delete
                    </Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}