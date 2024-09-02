"use client"
import { useSession } from "next-auth/react"

const logo = () => {
  const {status} = useSession();

  return (
    status ==="authenticated"&&
    <div className="lg:bg-transparent w-full lg:w-[13rem] lg:fixed lg:top-5 lg:left-2 z-50 bg-neutral-950 bg-[radial-gradient(ellipse_40%_80%_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))] py-3 lg:py-5 lg:bg-none lg:h-20">
          <h1 className="text-2xl lg:text-4xl font-bold text-center hover:cursor-default">Imagina</h1>
          </div>
  )
}

export default logo