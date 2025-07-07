"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BudgetCategoryBarChart } from "@/components/budget-bar-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "./budget-table/data-table";
import { columns } from "./budget-table/columns";
import AddNewBudget from "@/components/new-budget-popup";
import BudgetTitle from "./budget-components/title";
import { BudgetCards, DataCards } from "./budget-components/budget-info-cards";
import { getBudgetSummary } from "@/app/helper-functions/get-budget-card-data";
import { getBudgetTableData } from "@/supabase/get-budget-table-data";
import { motion } from "framer-motion";

export interface BudgetData {
  id: string;
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  progress: number;
  title: string;
}

export default function BudgetPage() {
  const [cardData, setCardData] = useState<DataCards[]>();
  const [allData, setAllData] = useState<BudgetData[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

      if (actualProgress < 80) onTrackCount++;
      if (actualProgress >= 80 && actualProgress < 100) nearingLimit.push(item.category);
      if (actualProgress >= 100) overBudget.push(item.category);
      if (item.spent > 100 && !["rent", "groceries"].includes(item.category)) {
        highSpending.push(item.category);
      }
    });

    const onTrackPercentage =
      allData.length > 0
        ? ((onTrackCount / allData.length) * 100).toFixed(0)
        : 0;

    return {
      onTrack: onTrackPercentage,
      nearingLimitCategories: nearingLimit,
      overBudgetCategories: overBudget,
      suggestedReductionCategories: highSpending,
    };
  }, [allData]);

  const handleMonthChange = (direction: number) => {
    setCurrentMonth((prev) => {
      const updated = new Date(prev);
      updated.setMonth(prev.getMonth() + direction);
      return updated;
    });
  };

  const monthDisplay = currentMonth.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    async function refresh() {
      const [summary, table] = await Promise.all([
        getBudgetSummary(currentMonth),
        getBudgetTableData(currentMonth),
      ]);
      setCardData(summary);
      setAllData(table);
    }
    refresh();
  }, [currentMonth]);

  return (
    <div className="transition-all duration-300 py-10 px-6 md:px-10 w-full md:w-[100vw] lg:w-[85vw] lg:mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <BudgetTitle monthDisplay={monthDisplay} />
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Button variant="outline" onClick={() => handleMonthChange(-1)}>
            Previous Month
          </Button>
          <Button variant="outline" onClick={() => handleMonthChange(1)}>
            Next Month
          </Button>
        </div>
      </div>

      {cardData && <BudgetCards initialBudgetCardData={cardData} />}

      {mounted && allData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-5"
        >
          <BudgetCategoryBarChart />
        </motion.div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Budget vs Spending
          </h2>
          <AddNewBudget
            onBudgetAdded={() => {
              getBudgetTableData(currentMonth).then(setAllData);
              getBudgetSummary(currentMonth).then(setCardData);
            }}
          />
        </div>
        <div className="rounded-md border bg-white dark:bg-background p-3 shadow-sm overflow-x-auto"> 
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
          <CardTitle className="text-sm text-gray-900 dark:text-gray-100">Insights</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          {allData.length === 0 ? (
            <p>No budget data to generate insights.</p>
          ) : (
            <>
              <p>
                • You&apos;re on track with{" "}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {insights.onTrack}%
                </span>{" "}
                of your categories.
              </p>
              {insights.nearingLimitCategories.length > 0 && (
                <p>
                  •{" "}
                  <span className="text-orange-500 dark:text-orange-400 font-medium">
                    {insights.nearingLimitCategories.join(", ")}
                  </span>{" "}
                  {insights.nearingLimitCategories.length === 1 ? "is" : "are"} nearing{" "}
                  {insights.nearingLimitCategories.length === 1 ? "its" : "their"} limit.
                </p>
              )}
              {insights.overBudgetCategories.length > 0 && (
                <p>
                  •{" "}
                  <span className="text-red-500 dark:text-red-400 font-medium">
                    {insights.overBudgetCategories.join(", ")}
                  </span>{" "}
                  {insights.overBudgetCategories.length === 1 ? "is" : "are"} over budget!
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