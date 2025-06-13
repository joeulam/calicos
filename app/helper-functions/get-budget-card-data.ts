import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/supabase/user-function";
import { DataCards } from "../[user]/budget/budget-components/budget-info-cards";
export async function getBudgetSummary(currentMonth: Date): Promise<DataCards[]> {
  const supabase = createClient();
  const user = await getUser();

  if (!user.user) {
    throw new Error("Not authenticated");
  }

  const fromDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const toDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const { data, error } = await supabase
    .from("transactions")
    .select("total, type, created_at")
    .gte("created_at", fromDate.toISOString())
    .lte("created_at", toDate.toISOString())
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
      subTitle: "This month",
    },
    {
      title: "Total Expenses",
      amount: expenses,
      subTitle: "This month",
    },
    {
      title: "Remaining Balance",
      amount: income - expenses,
      subTitle: "This month",
    },
  ];
}
