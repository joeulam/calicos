"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BudgetCategoryBarChart } from "@/components/budget-bar-chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "./budget-table/data-table";
import { columns } from "./budget-table/columns";
import AddNewBudget from "@/components/new-budget-popup";
import BudgetTitle from "./budget-components/title";
import { BudgetCards, DataCards } from "./budget-components/budget-info-cards";
import { getBudgetSummary } from "@/app/helper-functions/get-budget-card-data";
import { getBudgetTableData } from "@/supabase/get-budget-table-data";
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

  const handleMonthChange = (direction:number) => {
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

  useEffect(()=>{
    async function cardData(){
      const budgetCardData = await getBudgetSummary(currentMonth);
      setCardData(budgetCardData)

      async function refresh() {
        const [summary, table] = await Promise.all([
          getBudgetSummary(currentMonth),
          getBudgetTableData(currentMonth),
        ]);
        setCardData(summary);
        setAllData(table);
      }
    
      refresh();
      
    }

    async function fetchAllData() {
      const result = await getBudgetTableData(currentMonth);
      setAllData(result);
      console.log(result)
    }  
    fetchAllData();
    cardData()
  }, [currentMonth])
  return (
    <div className="transition-all duration-300 py-10 px-6 md:px-10 w-full md:w-[100vw] lg:w-[85vw] lg:mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <BudgetTitle monthDisplay={monthDisplay}/>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:items-center">
          <Button variant="outline" onClick={() => handleMonthChange(-1)}>
            Previous Month
          </Button>
          <Button variant="outline" onClick={() => handleMonthChange(1)}>
            Next Month
          </Button>
        </div>
      </div>

      <BudgetCards initialBudgetCardData={cardData!}/>

      <div className="mt-6">
        <BudgetCategoryBarChart />
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-700">
            Budget vs Spending
          </h2>
          <AddNewBudget onBudgetAdded={() => {
  getBudgetTableData(currentMonth).then(setAllData);
  getBudgetSummary(currentMonth).then(setCardData);
}} />
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
