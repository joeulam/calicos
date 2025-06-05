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

const sampleLineData = [
  { date: "May 1", amount: 120 },
  { date: "May 2", amount: 150 },
  { date: "May 3", amount: 80 },
  { date: "May 4", amount: 210 },
  { date: "May 5", amount: 130 },
];

export function SpendingLineChart({
  data = sampleLineData,
  title = "Spending Over Time",
  description = "Track your daily spending pattern",
}: {
  data?: { date: string; amount: number }[];
  title?: string;
  description?: string;
}) {
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
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
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
