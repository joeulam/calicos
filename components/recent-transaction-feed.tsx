"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { BudgetItem } from "@/supabase/create-new-budget-function";

export function RecentTransactionsCard({
  transactions,
  categoryMap,
}: {
  transactions: BudgetItem[];
  categoryMap: Record<string, string>;
}) {
  const sorted = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);
  return (
    <Card className="rounded-md border border-muted shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-800">
          Recent Transactions
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Last 5 entries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        {sorted.map((tx) => {
          const isExpense = tx.type === "expense";
          const categoryName =
            tx.category_id && categoryMap[tx.category_id]
              ? categoryMap[tx.category_id]
              : "Uncategorized";

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {tx.vendor || tx.description || "Unnamed"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {categoryName} ·{" "}
                  {new Date(tx.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div
                className={`flex items-center gap-1 font-medium ${
                  isExpense ? "text-red-600" : "text-green-600"
                }`}
              >
                {isExpense ? (
                  <ArrowDownRight className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
                <span>${Math.abs(tx.total).toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
