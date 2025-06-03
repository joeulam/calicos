'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter()
  return (
   <div>
      <div>
        <h1>Welcome to Calico</h1>
        <p>A AI powered financal budgetting app</p>
      </div>
      <div>
        <Button className="cursor-pointer" onClick={() => router.push("/login")}>Login</Button>
        <Button className="cursor-pointer" onClick={() => router.push("/signup")}>Sign up</Button>
      </div>
      
   </div>
  );
}
