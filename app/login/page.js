"use client"
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Form,Socials } from '@/components/export'

const Login = () => {
    const { data: session } = useSession()

    session && redirect("/")
    return (
        <div className=' flex  w-full h-screen justify-center items-center gap-80'>

        <h1 className='font-bold text-5xl text-center'>Imagina</h1>
        <div className=' flex flex-col space-y-10 '>
       <Form/>
       <Socials/>
        </div>
    </div>
    )
}

export default Login;