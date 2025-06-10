import { createClient } from "@/utils/supabase/client";

export interface BudgetItem{
  id:string,
  user_id: string,
  vendor: string,
  description?: string,
  total: number,
  date: Date,
  category_id?: string,
  created_at: Date
  type: string
  
}

export async function createNewBudget(budgetItem : BudgetItem){
  const supabase = createClient();
  const { error } = await supabase
  .from('budget')
  .insert(budgetItem)
  console.log(budgetItem)
  if(error){
    console.log(error)
  }
}
