"use client"
import { mainFun, signUp } from "@/functions/export";
import Link from "next/link";
import { redirect } from "next/navigation";

const signupForm = () => {

  // form imports
  const { toggle, changing, change, toggled } = mainFun()

  const submit = async (data) => {
    const res = await signUp(data)
    if (res.success) {
      redirect("/login")
    }
    else {
      alert(res.msg)
    }
  }

  return (
    <>
      {/* Main code */}
      <div className=" relative w-full h-full flex justify-center items-center text-white">

        <div className=' flex flex-col space-y-5 w-full'>

          <h2 className=' font-bold text-2xl text-center mb-5'>Sign Up</h2>

          <form action={submit} className=' space-y-5 text-black' >

            <div className=" flex w-full justify-between">

              <div className=' bg-white rounded-lg py-4 px-2 w-[48%] flex justify-center'>
                <input placeholder='First Name' autoComplete='off' className=' w-[95%] focus:outline-none' name="fName" required type="text" />
              </div>

              <div className=' bg-white rounded-lg py-4 px-2 flex justify-center w-[48%]'>
                <input placeholder='Last Name' autoComplete='off' className=' w-[95%] focus:outline-none' name="lName" required type="text" />
              </div>
            </div>

            <div className=' bg-white rounded-lg py-4 px-2 w-full flex justify-center'>
              <input placeholder='Username' autoComplete='off' className=' w-[95%] focus:outline-none' name="username" type="text" />
            </div>

            <div className=' bg-white rounded-lg py-4 px-2 w-full flex justify-center'>
              <input placeholder='Email' autoComplete='off' className=' w-[95%] focus:outline-none' name="email" required type="email" />
            </div>

            <div className=' relative bg-white rounded-lg py-4 px-2 w-full flex justify-center'>
              <input placeholder='Password' autoComplete='off' className=' w-[95%] focus:outline-none' name="password" required id="" onChange={change} type={toggle ? "text" : "password"} />

              <p className=" absolute top-[30%] right-2 hover:cursor-pointer text-black" onClick={toggled} style={{ display: changing ? "block" : 'none' }}>{toggle ? "Hide" : "Show"}</p>
            </div>

            <div className=' flex flex-col gap-2 text-white'>
              <button className='  bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg px-5 py-2.5 text-center me-2 mb-2 bg-blue-400 w-full font-bold text-xl '>Sign Up</button>

              <p className=' mr-2'>Already have account? <Link href='/login' className="text-blue-600">Login</Link></p>
            </div>

          </form>

        </div>
      </div>
    </>
  );
};

export default signupForm;