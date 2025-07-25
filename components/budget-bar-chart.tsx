"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { CategorySpending, getTopSpendingCategories } from "@/supabase/get-category-spending";
import { useTheme } from "@/components/theme-provider";


export function BudgetCategoryBarChart({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState<CategorySpending[]>([]);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadData = async () => {
      const current = await getTopSpendingCategories(month, year);

      const prevDate = new Date(year, month - 2);
      const prev = await getTopSpendingCategories(
        prevDate.getMonth() + 1,
        prevDate.getFullYear()
      );

      setData(current.categories);

      if (prev.total === 0) {
        setPercentChange(null);
      } else {
        const change = ((current.total - prev.total) / prev.total) * 100;
        setPercentChange(change);
      }
    };

    loadData();
  }, [month, year, mounted]);

  const textColor = isDarkMode ? "#E5E7EB" : "#1F2937";
  const gridColor = isDarkMode ? "#4B5563" : "#D1D5DB";
  const tooltipBgColor = isDarkMode ? "#374151" : "#F9FAFB";
  const barFillColor = isDarkMode ? "#fb923c" : "#f97316";

  return (
    <div className="rounded-md border bg-white dark:bg-background p-3 shadow-sm">
      <h2 className="text-sm font-medium text-foreground mb-2">
        Top 10 Spending Categories
      </h2>
      {mounted && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 80, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              stroke={textColor}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={100}
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
              itemStyle={{ color: textColor }}
              wrapperStyle={{ outline: "none" }}
            />
            <Bar
              dataKey="amount"
              fill={barFillColor}
              radius={[0, 6, 6, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        mounted && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No spending data available.
          </p>
        )
      )}

      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
        {percentChange === null ? (
          "No data for previous month"
        ) : (
          <>
            {percentChange > 0 ? "+" : ""}
            {percentChange.toFixed(1)}% from last month{" "}
            <TrendingUp
              className={`h-3 w-3 ${
                percentChange >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            />
          </>
        )}
      </div>
    </div>
  );
}
