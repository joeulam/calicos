"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
const mockBudgetData = [
  { category: "Dining Out", budget: 300, spent: 396, month: "2024-05" },
  { category: "Groceries", budget: 500, spent: 560, month: "2024-05" },
  { category: "Subscriptions", budget: 50, spent: 54, month: "2024-05" },
  { category: "Rent", budget: 1200, spent: 1200, month: "2024-05" },
  { category: "Transportation", budget: 150, spent: 100, month: "2024-05" },
  { category: "Utilities", budget: 200, spent: 180, month: "2024-05" },
  { category: "Savings", budget: 400, spent: 400, month: "2024-05" },

  { category: "Dining Out", budget: 300, spent: 250, month: "2024-04" },
  { category: "Groceries", budget: 500, spent: 480, month: "2024-04" },
  { category: "Rent", budget: 1200, spent: 1200, month: "2024-04" },
  { category: "Utilities", budget: 200, spent: 220, month: "2024-04" },
];

const DateRangePicker = ({ selectedMonth, onMonthChange }) => {
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
  const { state } = useSidebar();

  const [selectedMonth, setSelectedMonth] = useState(new Date(2024, 4, 1));
  const filteredData = useMemo(() => {
    const yearMonth = selectedMonth.toISOString().slice(0, 7);
    return mockBudgetData.filter((item) => item.month === yearMonth);
  }, [selectedMonth]);

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
    const netVariance = totalBudget - totalSpent; // Positive if under budget, negative if over

    return {
      totalBudget,
      totalSpent,
      budgetUsedPercentage: `${budgetUsedPercentage}%`,
      overBudgetCategoriesCount: overBudgetCount,
      netVariance: netVariance,
      overspendingAlerts: overspendingAlerts,
    };
  }, [filteredData]);
  const monthlySpendingTrendData = useMemo(() => {
    const trends = {};
    mockBudgetData.forEach((item) => {
      if (!trends[item.month]) {
        trends[item.month] = { spent: 0, budget: 0 };
      }
      trends[item.month].spent += item.spent;
      trends[item.month].budget += item.budget;
    });
    return Object.keys(trends)
      .sort()
      .reduce((obj, key) => {
        obj[key] = trends[key];
        return obj;
      }, {});
  }, []);

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
        monthlyTrends: monthlySpendingTrendData,
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
    console.log(
      "Exporting report for:",
      selectedMonth.toLocaleString("en-US", { month: "long", year: "numeric" })
    );
  };

  return (
    <div
      className={`transition-all duration-300 py-10 px-6 md:px-10 ${
        state === "expanded"
          ? "w-[80vw] sm:w-[100vw]"
          : "mx-auto w-[100vw] sm:w-[100vw]"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Analyze budget effectiveness and explore detailed spending trends.
          </p>
        </div>
        <DateRangePicker
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Used</CardTitle>
            <CardDescription>
              Percentage spent for{" "}
              {selectedMonth.toLocaleString("en-US", { month: "long" })}
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
              Budget vs. actual for{" "}
              {selectedMonth.toLocaleString("en-US", { month: "long" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-semibold ${
                netVariance < 0 ? "text-red-500" : "text-green-600"
              }`}
            >
              {netVariance < 0 ? "-" : "+"}${Math.abs(netVariance).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5 mb-5">
        <Card>
          <CardHeader>
            <CardTitle>
              Spending by Category (
              {selectedMonth.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
              )
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]"></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Overspending Alerts (
            {selectedMonth.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
            )
          </CardTitle>
          <CardDescription>
            Review categories that exceeded your set limits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {overspendingAlerts.length > 0 ? (
            overspendingAlerts.map((item) => (
              <div key={item.name} className="flex justify-between text-sm">
                <span>{item.name}</span>
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
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleExportReport}
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
