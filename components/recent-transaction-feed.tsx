"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const transactions = [
  {
    id: 1,
    name: "Starbucks",
    category: "Dining",
    amount: -8.75,
    date: "Jun 4",
  },
  {
    id: 2,
    name: "Spotify",
    category: "Subscription",
    amount: -9.99,
    date: "Jun 3",
  },
  {
    id: 3,
    name: "Paycheck",
    category: "Income",
    amount: 1200,
    date: "Jun 1",
  },
];

export function RecentTransactionsCard() {
  return (
    <Card className="rounded-md border border-muted shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-800">Recent Transactions</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Last 3 entries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium text-gray-800">{tx.name}</p>
              <p className="text-xs text-muted-foreground">
                {tx.category} · {tx.date}
              </p>
            </div>
            <div className={`flex items-center gap-1 font-medium ${tx.amount < 0 ? "text-red-600" : "text-green-600"}`}>
              {tx.amount < 0 ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              <span>${Math.abs(tx.amount).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
