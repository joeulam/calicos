"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Flame } from "lucide-react";

const overspending = [
  { category: "Dining Out", percent: 32 },
  { category: "Groceries", percent: 12 },
  { category: "Subscriptions", percent: 8 },
];

export function TopOverspendingCard() {
  return (
    <Card className="rounded-md border border-muted shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-800">
          Top Overspending
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Categories over budget
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4">
        {overspending.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm text-gray-700"
          >
            <div className="flex items-center gap-1">
              {item.percent >= 30 && (
                <Flame className="h-4 w-4 text-red-500" strokeWidth={2} />
              )}
              <span>{item.category}</span>
            </div>
            <span className="text-red-600 font-semibold">+{item.percent}%</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
