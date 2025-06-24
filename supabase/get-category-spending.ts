import { createClient } from "@/utils/supabase/client";

export async function getTopSpendingCategories() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transaction_categories")
    .select(`
      category_id,
      transactions(total, type),
      categories(id, name, emoji)
    `)
    .returns<
      {
        category_id: string;
        transactions: { total: number; type: string };
        categories: { id: string; name: string; emoji: string };
      }[]
    >();

  if (error || !data) {
    console.error("Failed to fetch transactions with categories", error);
    return [];
  }

  const categoryTotals: Record<string, { label: string; amount: number }> = {};

  for (const row of data) {
    if (row.transactions?.type !== "expense") continue;

    const total = row.transactions.total ?? 0;
    const catId = row.category_id;
    const name = row.categories?.name ?? "Uncategorized";
    const emoji = row.categories?.emoji ?? "";
    const label = `${name} ${emoji}`.trim();

    if (!categoryTotals[catId]) {
      categoryTotals[catId] = { label, amount: 0 };
    }

    categoryTotals[catId].amount += total;
  }

  return Object.values(categoryTotals)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
}
