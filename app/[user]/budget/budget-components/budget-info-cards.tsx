"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";

export interface DataCards {
  title: string;
  amount: number;
  subTitle: string;
}

export function BudgetCards({ initialBudgetCardData }: { initialBudgetCardData: DataCards[] }) {
  const { isDarkMode } = useTheme();

  if (!initialBudgetCardData || initialBudgetCardData.length === 0) {
    return (
      <Card className="h-24 rounded-md border shadow-sm flex items-center justify-center">
        <CardHeader>
          <CardTitle className="text-center text-foreground">Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const progressBarTrackColor = isDarkMode ? "bg-gray-700" : "bg-gray-200";
  const progressBarFillColor = isDarkMode ? "bg-blue-400" : "bg-blue-500";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {initialBudgetCardData.map((item, index) => (
        <Card
          key={index}
          className="h-24 rounded-md border border-muted shadow-sm hover:shadow transition relative overflow-hidden"
        >
          <CardHeader className="p-2 -mt-5">
            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-sm text-gray-700 dark:text-gray-300 font-normal">
                {item.title}
              </CardTitle>
              <div className={`text-lg font-semibold text-primary ${Number(item.amount.toFixed(2)) >= 0 ? `text-black dark:text-white` : `text-red-600 dark:text-red-400`}`}>
                ${item.amount.toFixed(2)}
              </div>
              <CardDescription className="text-xs text-muted-foreground leading-tight">
                {item.subTitle}
              </CardDescription>
            </div>
          </CardHeader>
          <div className={`absolute bottom-0 left-0 w-full h-1 ${progressBarTrackColor}`}>
            <div
              className={`h-full ${progressBarFillColor}`}
              style={{ width: `${Math.min(100, Math.max(0, (item.amount / parseFloat(item.subTitle.replace('of $', '').replace(',', '')) * 100)))}%` }}
            ></div>
          </div>
        </Card>
      ))}
    </div>
  );
}