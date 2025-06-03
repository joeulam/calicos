import { createClient } from "@/utils/supabase/server";
import "../globals.css";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect(`/${user.id}/dashboard`);
  }
  return <div>{children}</div>;
}
