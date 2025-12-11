"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { createContext } from "vm";
import { Button } from "@/components/ui/button";
import { ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Manager, PaginatedManager } from "@/lib/manager";
import { Editor } from "./editors/editor";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/components/ui/dialog";

export function DataManager<TData, TValue, TFilter>(
    { columns, manager, editor }: {
        columns: ColumnDef<TData, TValue>[],
        manager: Manager<TData, TFilter>,
        editor: Editor<TData>
    }
) {
    const EditorArgument = editor;

    const [data, setData] = useState<TData[]>([]);
    const [isBusy, setIsBusy] = useState(false);
    const [editTarget, setEditTarget] = useState<TData | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);

    function handleLoad() {
        setIsBusy(true);
        if (manager.supportsPagination) {
            (manager as PaginatedManager<TData, TFilter>).listPaginated({ page: currentPage, limit: 50 })
                .then((data) => {
                    setMaxPages(data.totalPages);
                    setCurrentPage(data.page);
                    setData(data.data);
                    setIsBusy(false);
                })
        } else {
            manager.list({})
                .then((data) => {
                    setData(data);
                    setIsBusy(false);
                })
        }
    }

    function handleEdit(target: TData | null) {
        setEditTarget(target);
        setIsEditing(true);
    }

    function handleEditorClose(refresh?: boolean) {
        setIsEditing(false);
        if (refresh) handleLoad();
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        handleLoad();
    }, [manager, currentPage])

    return <>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent className="sm:max-w-160">
                <EditorArgument manager={manager} item={editTarget} onClose={handleEditorClose} />
            </DialogContent>
        </Dialog>
        <DataTable 
            className="relative flex-1 -m-4 mb-0"
            data={data} columns={columns} busy={isBusy}
            onRowClick={handleEdit} />
        <div className="flex flex-row items-center gap-2 -m-4 p-4 mt-0 h-16 border-t bg-popover text-popover-foreground">
            <Button onClick={() => handleEdit(null)}>
                <PlusIcon />
                New
            </Button>
            <span className="flex-1"></span>
            {maxPages > 1 && <>
                <span className="block px-2 ml-3 lining-nums">
                    {currentPage} / {maxPages}
                </span>
                <Button variant="outline" size="icon" 
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(1)}>
                    <ChevronsLeftIcon />
                    <span className="sr-only">First</span>
                </Button>
                <Button variant="outline" size="icon"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(currentPage - 1)}>
                    <ChevronLeftIcon />
                    <span className="sr-only">Previous</span>
                </Button>
                <Button variant="outline" size="icon"
                    disabled={currentPage >= maxPages}
                    onClick={() => setCurrentPage(currentPage + 1)}>
                    <ChevronRightIcon />
                    <span className="sr-only">Next</span>
                </Button>
                <Button variant="outline" size="icon"
                    disabled={currentPage >= maxPages}
                    onClick={() => setCurrentPage(maxPages)}>
                    <ChevronsRightIcon />
                    <span className="sr-only">Last</span>
                </Button>
            </>}
        </div>
    </>
} 