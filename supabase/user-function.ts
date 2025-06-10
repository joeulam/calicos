import { createClient } from "@/utils/supabase/client";

export async function getUser(){
  const supabase = createClient();
  const { data } = await supabase.auth.getUser()
  return data
}