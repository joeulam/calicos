import { createClient } from "@/utils/supabase/client";

export async function getBudgetTableData(currentMonth: Date) {
  const supabase = createClient();
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const { data: budgetCategories, error: bcError } = await supabase
    .from("budget_categories")
    .select(
      `
      budget_id,
      category_id,
      budgets(id, title, amount),
      categories(id, name, emoji)
    `
    )
    .returns<
      {
        budget_id: string;
        category_id: string;
        budgets: { id: string; title: string; amount: number };
        categories: { id: string; name: string; emoji: string };
      }[]
    >();

  if (bcError || !budgetCategories) {
    console.error("Failed to fetch budget-category data", bcError);
    return [];
  }

  const budgetMeta: Record<string, { title: string; amount: number }> = {};
  const categoryMap: Record<string, { name: string; emoji: string }> = {};
  const budgetToCategories: Record<string, Set<string>> = {};

  for (const row of budgetCategories) {
    const budgetId = row.budget_id;
    const categoryId = row.category_id;

    if (!budgetMeta[budgetId]) {
      budgetMeta[budgetId] = {
        title: row.budgets?.title ?? "Untitled",
        amount: row.budgets?.amount ?? 0,
      };
      budgetToCategories[budgetId] = new Set();
    }

    if (categoryId) {
      budgetToCategories[budgetId].add(categoryId);
    }

    if (row.categories) {
      categoryMap[categoryId] = {
        name: row.categories.name,
        emoji: row.categories.emoji ?? "",
      };
    }
  }

  const { data: transactionCategories, error: txError } = await supabase
    .from("transaction_categories")
    .select("category_id, transaction_id, transactions(total, type, date)")
    .gte("transactions.date", firstDay.toISOString())
    .lte("transactions.date", lastDay.toISOString())
    .returns<
      {
        category_id: string;
        transaction_id: string;
        transactions: { total: number; type: string; date: string };
      }[]
    >();

  if (txError || !transactionCategories) {
    console.error("Failed to fetch transaction-category links", txError);
    return [];
  }

  const budgetSpent: Record<string, number> = {};

  for (const tx of transactionCategories) {
    if (tx.transactions?.type !== "expense") continue;

    const amount = tx.transactions.total ?? 0;

    for (const budgetId in budgetToCategories) {
      if (budgetToCategories[budgetId].has(tx.category_id)) {
        budgetSpent[budgetId] = (budgetSpent[budgetId] || 0) + amount;
      }
    }
  }

  // Step 5: Format final table
  const result = Object.entries(budgetMeta).map(
    ([budgetId, { title, amount }]) => {
      const spent = budgetSpent[budgetId] ?? 0;
      const remaining = Math.max(amount - spent, 0);
      const progress = amount > 0 ? Math.round((spent / amount) * 100) : 0;

      const categoryLabels = Array.from(budgetToCategories[budgetId] ?? [])
        .map((catId) =>
          categoryMap[catId]
            ? `${categoryMap[catId].name} ${categoryMap[catId].emoji}`.trim()
            : "Uncategorized"
        )
        .join(", ");

      return {
        id: budgetId,
        title,
        category: categoryLabels,
        budget: amount,
        spent,
        remaining,
        progress,
      };
    }
  );

  return result;
}
