
"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Catagory = {
  name: string,
 // fill in later
}
export type BudgetTableProp = {
  category: string,
  budget: number,
  spent: number,
  remaining: number,
  progress: number
}

export const columns: ColumnDef<BudgetTableProp>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => (row.original.budget).toFixed(2)
  },
  {
    accessorKey: "spent",
    header: "Spent",
    cell: ({ row }) => (row.original.spent).toFixed(2)
  },
  {
    accessorKey: "remaining",
    header: "Remaining",
    cell: ({ row }) => (row.original.budget-row.original.spent).toFixed(2)
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (row.original.spent/row.original.budget).toFixed(2)

  },
]