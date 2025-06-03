import { createClient } from "@/utils/supabase/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function signin(
  email: string,
  password: string,
  router: AppRouterInstance
) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
  } else {
    console.log("User Login:", data.user);
    router.push(`/${data.user?.id}/dashboard`);
  }
}