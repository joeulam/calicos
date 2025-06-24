import { createClient } from "@/utils/supabase/client";

export async function getMonthlyTrends() {
  const supabase = await createClient();

  const [txRes, budgetRes] = await Promise.all([
    supabase.from("transactions").select("total, created_at, category_id"),
    supabase.from("budgets").select("amount, category_id"),
  ]);

  if (txRes.error || budgetRes.error) {
    console.error("Supabase Error:", txRes.error || budgetRes.error);
    return [];
  }

  const categoriesRes = await supabase
    .from("categories")
    .select("id, name");

  if (categoriesRes.error) {
    console.error("Failed to fetch categories:", categoriesRes.error);
    return [];
  }

  const categoryMap = Object.fromEntries(
    categoriesRes.data.map((cat) => [cat.id, cat.name])
  );

  const monthlyMap: Record<
    string,
    Record<string, { spent: number; budget: number }>
  > = {};

  for (const tx of txRes.data) {
    const category = tx.category_id;
    const name = categoryMap[category] || "Unknown";
    const month = new Date(tx.created_at).toISOString().slice(0, 7);
    
    if (!monthlyMap[month]) monthlyMap[month] = {};
    if (!monthlyMap[month][name])
      monthlyMap[month][name] = { spent: 0, budget: 0 };

    monthlyMap[month][name].spent += Number(tx.total);
  }

  for (const b of budgetRes.data) {
    const name = categoryMap[b.category_id] || "Unknown";
    for (const month in monthlyMap) {
      if (!monthlyMap[month][name]) {
        monthlyMap[month][name] = { spent: 0, budget: 0 };
      }
      monthlyMap[month][name].budget += Number(b.amount);
    }
  }

  const result: {
    month: string;
    category: string;
    spent: number;
    budget: number;
  }[] = [];

  for (const [month, categories] of Object.entries(monthlyMap)) {
    for (const [category, values] of Object.entries(categories)) {
      result.push({ month, category, ...values });
    }
  }

  return result;
}