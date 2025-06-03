import { createClient } from "@/utils/supabase/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function logout(router: AppRouterInstance) {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error.message);
  } else {
    console.log("Logged out");
    router.push("/");
  }
}
