"use client";

import { useSidebar } from "@/components/ui/sidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartBarHorizontal } from "@/components/bar-chart";
import { dashboardCards } from "@/app/dummy/dashcard-mock";
import "../../globals.css";

export default function Dashboard() {
  const { state } = useSidebar();

  return (
    <div
      className={`transition-all duration-300 py-10 px-6 md:px-10 ${
        state === "expanded"
          ? "w-[80vw]"
          : "mx-auto w-[100vw]"
      }`}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, <span className="font-medium">userName</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((item, index) => (
          <Card key={index}>
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <h2 className="text-2xl font-bold text-primary">${item.amount}</h2>
              <CardDescription>{item.subTitle}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-10 space-y-8">
        <section className="">
          <ChartBarHorizontal title="Expense Category" dateRange="" />
        </section>

        <section className="">
          <ChartBarHorizontal title="Income Category" dateRange="" />
        </section>
      </div>
    </div>
  );
}
