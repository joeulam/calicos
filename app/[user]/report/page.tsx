"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getMonthlyTrends } from "@/supabase/monthly-trend";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

const DateRangePicker = ({
  selectedMonth,
  onMonthChange,
}: {
  selectedMonth: Date;
  onMonthChange: (newMonth: Date) => void;
}) => {
  const currentMonthName = selectedMonth.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handlePreviousMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    onMonthChange(newMonth);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
        &lt;
      </Button>
      <span className="font-medium text-sm">{currentMonthName}</span>
      <Button variant="outline" size="sm" onClick={handleNextMonth}>
        &gt;
      </Button>
    </div>
  );
};

export default function ReportsPage() {
  const [monthlyTrendData, setMonthlyTrendData] = useState<
    { month: string; category: string; spent: number; budget: number }[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const filteredData = useMemo(() => {
    const yearMonth = selectedMonth.toISOString().slice(0, 7);
    return monthlyTrendData.filter((item) => item.month === yearMonth);
  }, [monthlyTrendData, selectedMonth]);

  useEffect(() => {
    getMonthlyTrends().then((data) => {
      console.log("Fetched monthly trends:", data);
      setMonthlyTrendData(data);
    });
  }, []);
  

  const monthlyTotals = useMemo(() => {
    const totals: Record<string, { spent: number; budget: number }> = {};
    for (const entry of monthlyTrendData) {
      if (!totals[entry.month]) {
        totals[entry.month] = { spent: 0, budget: 0 };
      }
      totals[entry.month].spent += entry.spent;
      totals[entry.month].budget += entry.budget;
    }
    return Object.entries(totals).map(([month, values]) => ({
      month,
      ...values,
    }));
  }, [monthlyTrendData]);

  const {
    totalBudget,
    totalSpent,
    budgetUsedPercentage,
    overBudgetCategoriesCount,
    netVariance,
    overspendingAlerts,
  } = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;
    let overBudgetCount = 0;
    const overspendingAlerts: { name: string; value: string }[] = [];

    filteredData.forEach((item) => {
      totalBudget += item.budget;
      totalSpent += item.spent;
      if (item.spent > item.budget) {
        overBudgetCount++;
        overspendingAlerts.push({
          name: item.category,
          value: `+${(((item.spent - item.budget) / item.budget) * 100).toFixed(
            0
          )}%`,
        });
      }
    });

    const budgetUsedPercentage =
      totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0;
    const netVariance = totalBudget - totalSpent;

    return {
      totalBudget,
      totalSpent,
      budgetUsedPercentage: `${budgetUsedPercentage}%`,
      overBudgetCategoriesCount: overBudgetCount,
      netVariance: netVariance,
      overspendingAlerts: overspendingAlerts,
    };
  }, [filteredData]);

  const handleExportReport = () => {
    const reportData = JSON.stringify(
      {
        selectedMonth: selectedMonth.toISOString().slice(0, 7),
        summary: {
          totalBudget,
          totalSpent,
          budgetUsedPercentage,
          overBudgetCategoriesCount,
          netVariance,
        },
        categoryData: filteredData,
        monthlyTrends: monthlyTrendData,
        overspending: overspendingAlerts,
      },
      null,
      2
    );

    const blob = new Blob([reportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget_report_${selectedMonth
      .toISOString()
      .slice(0, 7)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="transition-all duration-300 py-10 px-6 md:px-10 w-full md:w-[100vw] lg:w-[85vw] lg:mx-auto">
      <meta name="viewport" content="width=device-width, initial-scale=.7" />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Analyze budget effectiveness and explore detailed spending trends.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:items-center">
          <DateRangePicker
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Used</CardTitle>
            <CardDescription>
              Percentage spent for {selectedMonth.toLocaleString("en-US", { month: "long" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">
              {budgetUsedPercentage}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Over Budget Categories</CardTitle>
            <CardDescription>
              Exceeding planned budget this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-500">
              {overBudgetCategoriesCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Variance</CardTitle>
            <CardDescription>
              Budget vs. actual for {selectedMonth.toLocaleString("en-US", { month: "long" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-semibold ${netVariance < 0 ? "text-red-500" : "text-green-600"}`}>
              {netVariance < 0 ? "-" : "+"}${Math.abs(netVariance).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5 mb-5">
        <Card>
          <CardHeader>
            <CardTitle>
              Spending by Category ({selectedMonth.toLocaleString("en-US", { month: "long", year: "numeric" })})
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 80, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} width={100} />
                <Tooltip />
                <Bar dataKey="spent" fill="#f97316" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTotals}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="spent" stroke="#f87171" strokeWidth={2} name="Spent" />
                <Line type="monotone" dataKey="budget" stroke="#60a5fa" strokeWidth={2} name="Budget" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Overspending Alerts ({selectedMonth.toLocaleString("en-US", { month: "long", year: "numeric" })})
          </CardTitle>
          <CardDescription>
            Review categories that exceeded your set limits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {overspendingAlerts.length > 0 ? (
            overspendingAlerts.map((item) => (
              <div key={item.name} className="flex justify-between text-sm">
                <span>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
                <span className="text-red-600 font-medium">{item.value}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No categories over budget this month. Great job!
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end mt-5">
        <Button variant="outline" className="gap-2" onClick={handleExportReport}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
