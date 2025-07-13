import { createClient } from "@/utils/supabase/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

export async function signupNewUser(
  email: string,
  password: string,
  router: AppRouterInstance
) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        "{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}",
    },
  });

  if (error) {
    console.error("Signup error:", error.message);
  } else {
    console.log("User signed up:", data.user);
    router.push(`/${data.user?.id}/dashboard`);
    return (
      toast("Account Created")
    )
  }
}