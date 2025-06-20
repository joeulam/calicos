"use client";

import "../../globals.css";
import { BudgetGaugeChart } from "@/components/budget-gauge";
import { DonutCategoryChart } from "@/components/donunt-catagory";
import { SpendingLineChart } from "@/components/monthly-spending";
import { RecentTransactionsCard } from "@/components/recent-transaction-feed";
import { TopOverspendingCard } from "@/components/overspending-table";
export default function Dashboard() {
  return (
    <div className="transition-all duration-300 py-10 px-6 md:px-10 w-full md:w-[100vw] lg:w-[85vw] lg:mx-auto">
      <div className="px-0"> 
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="font-medium">userName</span>
          </p>
        </div>

        <div className="mt-5">
          <SpendingLineChart />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-10">
          <div className="flex justify-center">
            <BudgetGaugeChart percent={72} />
          </div>
          <DonutCategoryChart />
          <TopOverspendingCard />
          <RecentTransactionsCard />
        </div>
      </div>
    </div>
  );
}