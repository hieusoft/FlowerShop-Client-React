"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "./data-table";
import { createContext } from "vm";

export function DataManager<TData, TValue>(
    { columns }: {
        columns: ColumnDef<TData, TValue>[],
    }
) {
    const [data, setData] = useState<TData[]>([]);

    return <>
        <DataTable 
            className="flex-1 -m-4 mb-0 border-b"
            data={data} columns={columns} />
    </>
} 