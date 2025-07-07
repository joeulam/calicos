"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button"; 

export interface TransactionRow {
  id: string;
  type: string;
  date: Date;
  vendor: string;
  total: number;
  category: string;
  description: string;
}

export const columns = (
  onEdit: (transaction: TransactionRow) => void
): ColumnDef<TransactionRow>[] => [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => dayjs(row.original.date).format("MM/DD/YY"),
  },
  {
    accessorKey: "vendor",
    header: "Store",
  },
  {
    accessorKey: "total",
    header: "Cost",
    cell: ({ row }) => {
      const total = row.original.total;
      const type = row.original.type;
      const color = type === "expense" ? "text-red-500" : "text-green-600";
      return <span className={color}>${total.toFixed(2)}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <Button variant="ghost" onClick={() => onEdit(transaction)} className="h-8 w-8 p-0">
          Edit
        </Button>
      );
    },
  },
];