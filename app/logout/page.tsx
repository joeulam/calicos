"use client"

import { Label } from "@/components/ui/label"
import { logout } from "@/supabase/authFunctions"
import { useRouter } from "next/navigation"
export default function Logout(){
  const router = useRouter()
  logout(router)
  return(
    <>
      <div className="flex justify-center items-center h-screen">
        <Label >Logging out...</Label>
      </div>
    </>
  )
}