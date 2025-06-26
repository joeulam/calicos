"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Flame } from "lucide-react";
import { useMemo } from "react";
import { BudgetItem } from "@/supabase/create-new-budget-function";

export function TopOverspendingCard({
  transactions,
  categoryMap,
  categoryBudgets,
}: {
  transactions: BudgetItem[];
  categoryMap: Record<string, string>;
  categoryBudgets: Record<string, number>;
}) {
  const overspending = useMemo(() => {
    const totals: Record<string, number> = {};

    for (const tx of transactions) {
      if (tx.type !== "expense") continue;
      const id = tx.category_id ?? "uncategorized";
      totals[id] = (totals[id] || 0) + tx.total;
    }

    const overspent: { category: string; percent: number }[] = [];

    for (const id in totals) {
      const spent = totals[id];
      const limit = categoryBudgets[id] ?? Infinity;

      if (spent > limit && limit > 0) {
        const name = categoryMap[id] || "Uncategorized";
        const percent = Math.round(((spent - limit) / limit) * 100);
        overspent.push({ category: name, percent });
      }
    }

    return overspent.sort((a, b) => b.percent - a.percent).slice(0, 5);
  }, [transactions, categoryMap, categoryBudgets]);

  return (
    <Card className="rounded-md border border-muted shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Top Overspending
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Categories over budget
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4">
        {overspending.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            No overspending! You&apos;re doing great.
          </p>
        ) : (
          overspending.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm text-foreground"
            >
              <div className="flex items-center gap-1">
                {item.percent >= 30 && (
                  <Flame className="h-4 w-4 text-red-500 dark:text-red-400" strokeWidth={2} />
                )}
                <span>{item.category}</span>
              </div>
              <span className="text-red-600 dark:text-red-400 font-semibold">+{item.percent}%</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}