
"use client"

import { ColumnDef } from "@tanstack/react-table"


export type Catagory = {
  name: string,
}
export type BudgetTableProp = {
  title: string,
  budget: number,
  spent: number,
  remaining: number,
  progress: number
}

export const columns: ColumnDef<BudgetTableProp>[] = [
  {
    accessorKey: "title",
    header: "Name",
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