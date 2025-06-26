"use client";

import { PieChart, Pie, Cell } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";

export function BudgetGaugeChart({ percent }: { percent: number }) {
  const { isDarkMode } = useTheme();

  const remaining = 100 - percent;
  const gaugeData = [
    { name: "Used", value: percent },
    { name: "Remaining", value: remaining },
  ];

  const usedColor = "#10b981"; 
  const remainingColor = isDarkMode ? "#4B5563" : "#e5e7eb"; 

  return (
    <Card className="w-full max-w-sm rounded-md border border-muted shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Budget Usage
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          How much of your total budget is spent
        </CardDescription>
      </CardHeader>

      <CardContent className="relative h-[150px] flex items-center justify-center">
        <PieChart width={260} height={130}>
          <Pie
            data={gaugeData}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={1}
            dataKey="value"
          >
            <Cell fill={usedColor} />
            <Cell fill={remainingColor} />
          </Pie>
        </PieChart>

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {percent}%
          </p>
          <p className="text-xs text-muted-foreground">Used</p>
        </div>
      </CardContent>
    </Card>
  );
}