// components/Home.js
"use client";
import { Posts } from "@/components/export";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen overflow-y-scroll scrollbar-hide">
      <div className="w-[90%] lg:w-[32rem] h-full">
        <Posts />
      </div>
    </div>
  );
}
