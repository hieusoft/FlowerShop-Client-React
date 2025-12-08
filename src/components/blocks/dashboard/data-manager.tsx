"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "./data-table";
import { createContext } from "vm";
import { Button } from "@/components/ui/button";
import { ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function DataManager<TData, TValue>(
    { columns }: {
        columns: ColumnDef<TData, TValue>[],
    }
) {
    const [data, setData] = useState<TData[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);

    return <>
        <DataTable 
            className="flex-1 -m-4 mb-0"
            data={data} columns={columns} />
        <div className="flex flex-row items-center gap-2 -m-4 p-4 mt-4 border-t bg-popover text-popover-foreground">
            <span className="flex-1"></span>
            <span className="block px-2 ml-3 lining-nums">
                {currentPage} / {maxPages}
            </span>
            <Button variant="outline" size="icon">
                <ChevronsLeftIcon />
                <span className="sr-only">First</span>
            </Button>
            <Button variant="outline" size="icon">
                <ChevronLeftIcon />
                <span className="sr-only">Previous</span>
            </Button>
            <Button variant="outline" size="icon">
                <ChevronRightIcon />
                <span className="sr-only">Next</span>
            </Button>
            <Button variant="outline" size="icon">
                <ChevronsRightIcon />
                <span className="sr-only">Last</span>
            </Button>
        </div>
    </>
} 