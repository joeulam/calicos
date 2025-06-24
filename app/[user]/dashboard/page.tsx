"use client";

import { useEffect, useState } from "react";
import "../../globals.css";
import { BudgetGaugeChart } from "@/components/budget-gauge";
import { DonutCategoryChart } from "@/components/donunt-catagory";
import { SpendingLineChart } from "@/components/monthly-spending";
import { RecentTransactionsCard } from "@/components/recent-transaction-feed";
import { TopOverspendingCard } from "@/components/overspending-table";
import { getTransactions } from "@/supabase/get-transaction-function";
import { BudgetItem } from "@/supabase/create-new-budget-function";
import { createClient } from "@/utils/supabase/client";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<BudgetItem[]>([]);
  const [spendingPercent, setSpendingPercent] = useState(0);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const [categoryBudgets, setCategoryBudgets] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [transactionsRes, categoriesRes, budgetsRes] = await Promise.all([
        getTransactions(),
        supabase.from("categories").select("id, name"),
        supabase.from("budgets").select("category_id, amount"),
      ]);
      if (budgetsRes.data) {
        const budgetMap: Record<string, number> = {};
        for (const row of budgetsRes.data) {
          budgetMap[row.category_id] = Number(row.amount);
        }
        setCategoryBudgets(budgetMap);
      }

      if (transactionsRes) {
        setTransactions(transactionsRes);

        const spending = transactionsRes
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.total, 0);

        const budgetLimit = 1000;
        const percent = Math.min(
          Math.round((spending / budgetLimit) * 100),
          100
        );
        setSpendingPercent(percent);
      }

      if (categoriesRes.data) {
        const map: Record<string, string> = {};
        for (const cat of categoriesRes.data) {
          map[cat.id] = cat.name;
        }
        setCategoryMap(map);
      }
    }

    fetchData();
  }, []);

  if (!mounted) return null;

  return (
    <div className="transition-all duration-300 py-10 px-6 md:px-10 w-full md:w-[100vw] lg:w-[85vw] lg:mx-auto">
      <div className="px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="font-medium">{"joey"}</span>
          </p>
        </div>

        <div className="mt-5">
          <SpendingLineChart transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-10">
          <div className="flex justify-center">
            <BudgetGaugeChart percent={spendingPercent} />
          </div>
          {transactions.length > 0 && Object.keys(categoryMap).length > 0 && (
            <DonutCategoryChart
              transactions={transactions}
              categoryMap={categoryMap}
            />
          )}
          <TopOverspendingCard
            transactions={transactions}
            categoryMap={categoryMap}
            categoryBudgets={categoryBudgets}
          />
          <RecentTransactionsCard
            transactions={transactions}
            categoryMap={categoryMap}
          />
        </div>
      </div>
    </div>
  );
}
