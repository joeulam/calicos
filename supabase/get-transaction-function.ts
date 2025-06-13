import { createClient } from "@/utils/supabase/client";

export async function getTransactions(){
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('transactions')
  .select()
  if(error){
    console.log(error)
  }
  return data
}
