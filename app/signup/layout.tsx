'use client'
import { createClient } from "@/util/client";
import "../globals.css";
import { useRouter } from "next/navigation";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()

  const getUser = async() => {
    const supabase = createClient();
    const {data} = await supabase.auth.getUser()
    if(data != null){
      router.push(`/dashboard`)
    }
  }

  
  getUser()
  return (
      <body
      >
        {children}
      </body>
  );
}
