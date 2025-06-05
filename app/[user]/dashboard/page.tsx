"use client";

import { useSidebar } from "@/components/ui/sidebar";
import "../../globals.css";
import { BudgetGaugeChart } from "@/components/budget-gauge";
import { DonutCategoryChart } from "@/components/donunt-catagory";
import { SpendingLineChart } from "@/components/monthly-spending";
import { RecentTransactionsCard } from "@/components/recent-transaction-feed";
import { TopOverspendingCard } from "@/components/overspending-table";

export default function Dashboard() {
  return (
    <div
      className={`transition-all duration-300 py-10 px-6 md:px-10 w-[100vw] md:w-[80vw]`}
    >
      <div className="md:px-20 px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="font-medium">userName</span>
          </p>
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((item, index) => (
          <Card key={index}>
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <h2 className="text-2xl font-bold text-primary">
                ${item.amount}
              </h2>
              <CardDescription>{item.subTitle}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div> */}
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
