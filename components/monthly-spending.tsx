"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { useMemo } from "react";
import { BudgetItem } from "@/supabase/create-new-budget-function";

export function SpendingLineChart({
  transactions,
  title = "Spending Over Time",
  description = "Track your daily spending pattern",
}: {
  transactions: BudgetItem[];
  title?: string;
  description?: string;
}) {
  const chartData = useMemo(() => {
    const dailyTotals: Record<string, number> = {};

    for (const tx of transactions) {
      if (tx.type !== "expense") continue;

      const date = new Date(tx.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      dailyTotals[date] = (dailyTotals[date] || 0) + tx.total;
    }

    const sortedDates = Object.keys(dailyTotals).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    let cumulative = 0;
    const cumulativeData = sortedDates.map((date) => {
      cumulative += dailyTotals[date];
      return { date, amount: cumulative };
    });

    return cumulativeData;
  }, [transactions]);

  return (
    <Card className="w-full rounded-md border border-muted shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-800">
          {title}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[220px] px-4 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              fontSize={10}
              tickMargin={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={10}
              tickMargin={6}
            />
            <Tooltip
              contentStyle={{ borderRadius: 6, fontSize: "0.75rem" }}
              wrapperStyle={{ outline: "none" }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
