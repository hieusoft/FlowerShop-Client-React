"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  busy = false,
  onRowClick,
}: {
  columns: ColumnDef<TData, TValue>[],
  data: TData[],
  className?: ClassNameValue,
  busy: boolean,
  onRowClick?: (item: TData) => void
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("*:absolute *:w-full *:h-full overflow-y-auto", className)}>
        <Table className="absolute w-full max-h-full inset-0 overflow-y-auto">
            <TableHeader className="sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                  );
                })}
                <TableHead className="w-full"></TableHead>
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {busy ? (
              new Array(50).fill(0).map((_, index) => (
                <TableRow
                  key={index}
                >
                  {table.getHeaderGroups()[0].headers.map((cell) => (
                    <TableCell key={cell.id}>
                      <Skeleton className="h-4 my-0.5" style={{width: Math.random() * 100 + "%"}}></Skeleton>
                    </TableCell>
                  ))}
                <TableCell></TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    tabIndex={1}
                    onClick={() => onRowClick?.(row.original)}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                        )}
                    </TableCell>
                    ))}
                <TableCell></TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                >
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
    </div>
  );
}
