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
import { useTheme } from "@/components/theme-provider";

export function SpendingLineChart({
  transactions,
  title = "Spending Over Time",
  description = "Track your daily spending pattern",
}: {
  transactions: BudgetItem[];
  title?: string;
  description?: string;
}) {
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode ? "#E5E7EB" : "#1F2937";
  const gridColor = isDarkMode ? "#4B5563" : "#D1D5DB";
  const tooltipBgColor = isDarkMode ? "#374151" : "#F9FAFB";

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
        <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              fontSize={10}
              tickMargin={6}
              stroke={textColor}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={10}
              tickMargin={6}
              stroke={textColor}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 6,
                fontSize: "0.75rem",
                backgroundColor: tooltipBgColor,
                color: textColor,
                border: "none",
              }}
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