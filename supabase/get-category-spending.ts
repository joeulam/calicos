import { createClient } from "@/utils/supabase/client";

export type CategorySpending = {
  name: string;
  amount: number;
};

type SpendingResult = {
  categories: CategorySpending[];
  total: number;
};

type TransactionRow = {
  total: number;
  category_id: string;
  categories?: { name: string };
};

export async function getTopSpendingCategories(
  month: number,
  year: number
): Promise<SpendingResult> {
  const start = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 1);
  const end = `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-01`;

  const supabase = createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select(
      "total, category_id, categories!transactions_category_id_fkey(name)"
    )
    .gte("date", start)
    .lt("date", end)
    .returns<TransactionRow[]>();

  if (error) {
    console.error("Error fetching category spending:", { error, start, end });
    return { categories: [], total: 0 };
  }

  const grouped: Record<string, number> = {};
  let total = 0;

  for (const row of data ?? []) {
    const name = row.categories?.name || "Uncategorized";
    const amount = Number(row.total) || 0;

    grouped[name] = Number(((grouped[name] || 0) + amount).toFixed(2));
    
    total += amount;
  }

  const sorted = Object.entries(grouped)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
    return { categories: sorted, total };
}
