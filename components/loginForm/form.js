"use client"
import { mainFun } from "@/functions/export"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { redirect } from "next/navigation";
import { useState } from "react";


const form = () => {
    const { toggle, changing, change, toggled } = mainFun()
    const [submitting,setSubmiting] = useState(false)
    
    const submit = async(e)=>{
        const username =  e.get("username");
        const password =  e.get("password");
        const signInRes = await signIn("credentials",{
            username,
            password
        })
            if(signInRes && !signInRes.error){
                setSubmiting(false)
                redirect("/")
            }
            else if(!signInRes){
                setSubmiting(true)
                console.log("ignore this error for now");
            }
        
    }

  return (
    <div className=' flex flex-col space-y-5'>

                <h2 className=' font-bold text-2xl text-center mb-5'>Login</h2>

                <form action={submit} className=' space-y-5 text-black' >

                    <div className=' bg-white rounded-lg py-4 px-2 w-full flex justify-center'>
                        <input placeholder='Username' autoComplete='off' className=' w-[95%] focus:outline-none' name="username" required type="text" />
                    </div>

                    <div className=' relative bg-white rounded-lg py-4 px-2 w-full flex justify-center'>
              <input placeholder='Password' autoComplete='off' className=' w-[95%] focus:outline-none' name="password" required id="" onChange={change} type={toggle ? "text" : "password"}/>

              <p className=" absolute top-[30%] right-2 hover:cursor-pointer text-black" onClick={toggled} style={{ display: changing ? "block" : 'none' }}>{toggle ? "Hide" : "Show"}</p>
            </div>

                    <div className=' flex flex-col gap-2 text-white'>
                        <p className=' text-right'> <Link href="/forgot">Forgot password?</Link></p>


                        <button disabled={submitting} className={`bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg px-5 py-2.5 text-center me-2 mb-2 bg-blue-400 w-full font-bold text-xl`} >Login</button>

                        <p className=' mr-2'>First time? <Link className=" text-blue-600" href='/signUp'>Sign Up</Link></p>
                    </div>

                </form>
            </div>
  )
}

export default form