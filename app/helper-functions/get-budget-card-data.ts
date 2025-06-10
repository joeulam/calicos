import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/supabase/user-function";
import { DataCards } from "../[user]/budget/budget-components/budget-info-cards";

export async function getBudgetSummary() : Promise<DataCards[]> {
  const supabase = createClient();
  const user = await getUser();

  if (!user.user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("total, type, created_at")
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .eq("user_id", user.user.id);

  if (error || !data) {
    console.error("Error fetching transactions:", error);
    return []
  }

  let income = 0;
  let expenses = 0;

  for (const txn of data) {
    if (txn.type === "income") income += txn.total;
    else if (txn.type === "expense") expenses += txn.total;
  }

  return [
    {
      title: "Total Income",
      amount: income,
      subTitle: "Last 30 days",
    },
    {
      title: "Total Expenses",
      amount: expenses,
      subTitle: "Last 30 days",
    },
    {
      title: "Remaining Balance",
      amount: income - expenses,
      subTitle: "Last 30 days",
    },
  ];
}
