"use client"
import { Socials, SignupForm } from "@/components/export";
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

const SignUp = () => {
  const { data: session } = useSession()

  session && redirect("/")
  return (
    <>

      <div className=' flex w-full h-screen justify-center items-center gap-80'>

        <h1 className='font-bold text-5xl text-center'>Imagina</h1>
        <div className=' flex flex-col space-y-2'>
            <SignupForm />
          <Socials />
        </div>
      </div>

    </>
  );
};

export default SignUp;
