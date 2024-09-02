"use client";
import { useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import UploadForm from "./uploadForm";
import { useSession } from "next-auth/react";
import { TextUpload } from "@/actions/export";
import { CurrentUser } from "@/functions/export";
import Image from "next/image";
import Link from "next/link";

export default function CreatePost() {
  const { register, formState: { errors } } = useForm();
  const formRef = useRef(null);
  const [toggle, setToggle] = useState(false);
  const { data: session } = useSession();
  const uploadButtonRef = useRef(null);
  const uploadFormRef = useRef(null);
  const [profilePic,setProfilePic] = useState(false);

  const tog = () => {
    setToggle(!toggle);
  };

 useEffect(()=>{
    const res = CurrentUser(session.user.id);
    res.profilePic?setProfilePic(res.profilePic):setProfilePic(false);
 },[])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        uploadFormRef.current &&
        !uploadFormRef.current.contains(event.target) &&
        uploadButtonRef.current &&
        !uploadButtonRef.current.contains(event.target)
      ) {
        setToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative w-[80%] md:w-[70%] lg:w-full">
        {/* create post card  */}
        <form ref={formRef} action={e => TextUpload(e, session.user.id)}>
          <div className="flex items-center justify-center space-x-4">
            <div>
              <Link href={`/profile/${session.user.id}`}><Image src={profilePic?profilePic:"/icons/user.png"} className="object-cover object-center rounded-full" height={50} width={50} alt="profile pic"/></Link>
            </div>

            <div className="w-[60%] lg:w-full py-1 px-2 lg:px-4 lg:py-2 bg-white rounded-full text-black">
              <input
                {...register("text", {
                  required: { value: true, message: "You haven't entered anything" },
                })}
                className="focus:outline-none w-full"
                type="text"
                placeholder="What's on your mind?"
                autoComplete="off"
              />
            </div>
            {errors.text && <span>{errors.text.message}</span>}
          </div>
          <hr className="mt-3 mb-3" />
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={tog}
              type="button"
              className="px-2 py-1 flex items-center justify-center hover:bg-gray-100 rounded-lg hover:text-black"
              ref={uploadButtonRef}
            >
              <span className="hover:text-black font-medium">Photo / Video</span>
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm lg:px-2 py-1 text-center"
            >
              Post
            </button>
          </div>
        </form>

        <div
          className={`${toggle ? "block" : "hidden"} absolute z-40 bottom-[-90%] h-20 w-full`}
          ref={uploadFormRef}
        >
          <UploadForm />
        </div>
      </div>
    </>
  );
}
