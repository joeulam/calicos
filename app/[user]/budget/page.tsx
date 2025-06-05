"use client";

import React, { useState, useMemo } from "react";
import { budgetCard as initialBudgetCardData } from "@/app/dummy/budget-mock";
import { BudgetCategoryBarChart } from "@/components/budget-bar-chart";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DataTable } from "./budget-table/data-table";
import { columns } from "./budget-table/columns";

export default function BudgetPage() {
  const { state } = useSidebar();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [allData, setAllData] = useState([
    {
      id: "cat-1",
      category: "doggy",
      budget: 1200,
      spent: 600,
      remaining: 600,
      progress: 50,
    },
    {
      id: "cat-2",
      category: "rent",
      budget: 900,
      spent: 600,
      remaining: 300,
      progress: 66,
    },
    {
      id: "cat-3",
      category: "groceries",
      budget: 500,
      spent: 450,
      remaining: 50,
      progress: 90,
    },
    {
      id: "cat-4",
      category: "eating out",
      budget: 300,
      spent: 100,
      remaining: 200,
      progress: 33,
    },
  ]);

  const insights = useMemo(() => {
    if (allData.length === 0) {
      return {
        onTrack: 0,
        nearingLimitCategories: [],
        overBudgetCategories: [],
        suggestedReductionCategories: [],
      };
    }

    let onTrackCount = 0;
    const nearingLimit: string[] = [];
    const overBudget: string[] = [];
    const highSpending: string[] = [];

    allData.forEach((item) => {
      const actualProgress =
        item.budget > 0 ? (item.spent / item.budget) * 100 : 0;

      if (actualProgress < 80) {
        onTrackCount++;
      }
      if (actualProgress >= 80 && actualProgress < 100) {
        nearingLimit.push(item.category);
      }
      if (actualProgress >= 100) {
        overBudget.push(item.category);
      }

      if (
        item.spent > 100 &&
        item.category !== "rent" &&
        item.category !== "groceries"
      ) {
        highSpending.push(item.category);
      }
    });

    const totalCategories = allData.length;
    const onTrackPercentage =
      totalCategories > 0
        ? ((onTrackCount / totalCategories) * 100).toFixed(0)
        : 0;

    return {
      onTrack: onTrackPercentage,
      nearingLimitCategories: nearingLimit,
      overBudgetCategories: overBudget,
      suggestedReductionCategories: highSpending,
    };
  }, [allData]);

  const handleAddBudget = (newBudget) => {
    console.log("Adding new budget:", newBudget);
    setAllData((prevData) => [
      ...prevData,
      {
        id: `cat-${prevData.length + 1}`,
        category: newBudget.category,
        budget: parseFloat(newBudget.budget),
        spent: 0,
        remaining: parseFloat(newBudget.budget),
        progress: 0,
      },
    ]);
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + direction);
      return newMonth;
    });
  };

  const monthDisplay = currentMonth.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={`transition-all duration-300 py-10 px-6 md:px-10 w-[100vw] `}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Budget Overview</h1>
          <p className="text-sm text-muted-foreground">
            Summary for {monthDisplay}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:items-center">
          <Button variant="outline" onClick={() => handleMonthChange(-1)}>
            Previous Month
          </Button>
          <Button variant="outline" onClick={() => handleMonthChange(1)}>
            Next Month
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {initialBudgetCardData.map((item, index) => (
          <Card
            key={index}
            className="h-24 rounded-md border border-muted shadow-sm hover:shadow transition relative overflow-hidden" // Added relative and overflow-hidden for progress bar
          >
            <CardHeader className="p-2 -mt-5">
              <div className="flex flex-col gap-0.5">
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
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <BudgetCategoryBarChart data={allData} />
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-700">
            Budget vs Spending
          </h2>
          <Button variant="default">+ Add Budget</Button>
        </div>
        <div className="rounded-md border bg-white p-3 shadow-sm">
          {allData.length > 0 ? (
            <DataTable columns={columns} data={allData} />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No budget data available for this period.
            </p>
          )}
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Insights</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          {allData.length === 0 ? (
            <p>No budget data to generate insights.</p>
          ) : (
            <>
              <p>
                • You&apos;re on track with{" "}
                <span className="font-medium text-blue-600">
                  {insights.onTrack}%
                </span>{" "}
                of your categories.
              </p>
              {insights.nearingLimitCategories.length > 0 && (
                <p>
                  •{" "}
                  <span className="text-orange-500 font-medium">
                    {insights.nearingLimitCategories.join(", ")}
                  </span>{" "}
                  {insights.nearingLimitCategories.length === 1 ? "is" : "are"}{" "}
                  nearing{" "}
                  {insights.nearingLimitCategories.length === 1
                    ? "its"
                    : "their"}{" "}
                  limit.
                </p>
              )}
              {insights.overBudgetCategories.length > 0 && (
                <p>
                  •{" "}
                  <span className="text-red-500 font-medium">
                    {insights.overBudgetCategories.join(", ")}
                  </span>{" "}
                  {insights.overBudgetCategories.length === 1 ? "is" : "are"}{" "}
                  over budget!
                </p>
              )}
              {insights.suggestedReductionCategories.length > 0 && (
                <p>
                  • Consider reducing spending on{" "}
                  <span className="text-yellow-600 font-medium">
                    {insights.suggestedReductionCategories.join(", ")}
                  </span>
                  .
                </p>
              )}
              {insights.nearingLimitCategories.length === 0 &&
                insights.overBudgetCategories.length === 0 &&
                insights.suggestedReductionCategories.length === 0 && (
                  <p>
                    • Great job! All your categories are well within budget.
                  </p>
                )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
