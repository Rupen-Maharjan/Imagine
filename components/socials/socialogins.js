"use client"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"

const socialogins = () => {
    const [submitting,setSubmiting] =  useState(false)
  return (
    <div className=" space-y-10">


        <p className=' text-center text-slate-400'>Or</p>
    <div className=' flex gap-5'>
                    <button disabled={submitting} onClick={async()=> {setSubmiting(true); await signIn("google")}}
                        className="relative z-0 flex items-center gap-2 overflow-hidden rounded-lg border-[1px] 
        border-violet-300 px-4 py-2 font-semibold
        uppercase text-violet-300 transition-all duration-500
        
        before:absolute before:inset-0
        before:-z-10 before:translate-x-[150%]
        before:translate-y-[150%] before:scale-[2.5]
        before:rounded-[100%] before:bg-violet-300
        before:transition-transform before:duration-1000
        before:content-[&quot;&quot;]

        hover:scale-105 hover:text-neutral-900
        hover:before:translate-x-[0%]
        hover:before:translate-y-[0%]
        active:scale-95">
                            <Image src="/icons/google.png" height={20} width={20} alt="google"/>
                        <span>Continue with Google</span>
                    </button>


                    <button disabled={submitting} onClick={async() => {setSubmiting(true); await signIn("github")}}
                        className="relative z-0 flex items-center gap-2 overflow-hidden rounded-lg border-[1px] 
        border-violet-300 px-4 py-2 font-semibold
        uppercase text-violet-300 transition-all duration-500
        
        before:absolute before:inset-0
        before:-z-10 before:translate-x-[150%]
        before:translate-y-[150%] before:scale-[2.5]
        before:rounded-[100%] before:bg-violet-300
        before:transition-transform before:duration-1000
        before:content-[&quot;&quot;]

        hover:scale-105 hover:text-neutral-900
        hover:before:translate-x-[0%]
        hover:before:translate-y-[0%]
        active:scale-95">
                            <Image src="/icons/github.png" height={20} width={20} alt="github"/>
                        <span>Continue with Github</span>
                    </button>
                </div>
                </div>
  )
}

export default socialogins