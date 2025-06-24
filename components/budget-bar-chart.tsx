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
import { getTopSpendingCategories } from "@/supabase/get-category-spending";
type CategorySpending = {
  label: string;
  amount: number;
};

export function BudgetCategoryBarChart() {
  const [data, setData] = useState<CategorySpending[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getTopSpendingCategories().then(setData);
  }, []);

  return (
    <div className="rounded-md border bg-white p-3 shadow-sm">
      <h2 className="text-sm font-medium text-gray-700 mb-2">
        Top 10 Spending Categories
      </h2>
      {mounted && data.length > 0 && (

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 80, bottom: 0 }}
          
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis
            dataKey="label"
            type="category"
            tickLine={false}
            axisLine={false}
            width={100}
          />
          <Tooltip />
          <Bar dataKey="amount" fill="#f97316" radius={[0, 6, 6, 0]} isAnimationActive={true}/>
        </BarChart>
      </ResponsiveContainer>
      )}

      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
        +4.7% from last month <TrendingUp className="h-3 w-3 text-green-600" />
      </div>
    </div>
  );
}
