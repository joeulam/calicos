import { createClient } from "@/utils/supabase/client";
import "../globals.css";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.log(error);
  } else {
    console.log(data);
    redirect(`/${data.user?.id}/dashboard`);
  }
  return <body>{children}</body>;
}
