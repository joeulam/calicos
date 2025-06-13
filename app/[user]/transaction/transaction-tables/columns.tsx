"use client"

import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Catagory = {
  name: string,
 // fill in later
}
export interface TransactionRow {
  type: string
  date: Date
  vendor: string
  total: number
  category: Catagory
  id: string
}

export const columns: ColumnDef<TransactionRow>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => dayjs(row.original.date).format("MM/DD/YY")
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
  }
  
]

