"use client";

import { budgetCard } from "@/app/dummy/budget-mock";
import { BudgetCategoryBarChart } from "@/components/budget-bar-chart";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { DataTable } from "./budget-table/data-table";
import { columns } from "./budget-table/columns";

export default function BudgetPage() {
  const { state } = useSidebar();

  const allData = [
    {
      category: "doggy",
      budget: 1200,
      spent: 600,
      remaining: 600,
      progress: 50,
    },
    { category: "rent", budget: 900, spent: 600, remaining: 300, progress: 66 },
  ];

  return (
    <div
    className={`transition-all duration-300 py-10 px-6 md:px-10 ${
      state === "expanded"
        ? "w-[80vw] sm:w-[100vw]"
        : "mx-auto w-[100vw] sm:w-[100vw]"
    }`}
    >
      <div className="mb-4">
        <h1 className="text-xl font-medium text-gray-900">Budget Overview</h1>
        <p className="text-sm text-muted-foreground">This month’s summary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ">
        {budgetCard.map((item, index) => (
          <Card
            key={index}
            className="h-24 rounded-md border border-muted shadow-sm hover:shadow transition "
          >
            <CardHeader className="p-2 -mt-5">
              <div className="flex flex-col gap-0.5 ">
                <CardTitle className="text-sm text-gray-700 font-normal">
                  {item.title}
                </CardTitle>
                <div className="text-lg font-semibold text-primary">
                  ${item.amount.toFixed(2)}
                </div>
                <CardDescription className="text-xs text-muted-foreground leading-tight">
                  {item.subTitle}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <BudgetCategoryBarChart />
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-medium text-gray-700 mb-2">
          Budget vs Spending
        </h2>
        <div className="rounded-md border bg-white p-3 shadow-sm">
          <DataTable columns={columns} data={allData} />
        </div>
      </div>
    </div>
  );
}
