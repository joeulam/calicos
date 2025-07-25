import { createClient } from "@/utils/supabase/client";

export interface TransactionItem{
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

export async function submitTransaction(transactionData : TransactionItem){
  const supabase = createClient();
  const { error } = await supabase
  .from('transactions')
  .insert(transactionData)
  console.log(transactionData)
  if(error){
    console.log(error)
  }
}
