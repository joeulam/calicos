"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const COLORS = ["#6366f1", "#f97316", "#10b981", "#eab308", "#ec4899"];

const sampleData = [
  { name: "Rent", value: 1200 },
  { name: "Groceries", value: 450 },
  { name: "Transport", value: 200 },
  { name: "Health", value: 120 },
  { name: "Entertainment", value: 100 },
];

export function DonutCategoryChart({
  data = sampleData,
}: {
  data?: { name: string; value: number }[];
}) {
  return (
    <Card className="rounded-md border border-muted shadow-sm w-full max-w-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-800">
          Spending by Category
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Breakdown of your monthly spending
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <ResponsiveContainer width={240} height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-4 text-xs text-muted-foreground">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
