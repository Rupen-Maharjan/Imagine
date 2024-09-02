"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import UploadForm from "../home/uploadForm";
import Image from "next/image";
import { CurrentUser } from "@/functions/export";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [toggle, setToggle] = useState(false);
  const uploadButtonRef = useRef(null);
  const uploadFormRef = useRef(null);
  const [userImg, setUserImg] = useState("/icons/user.png");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        uploadFormRef.current &&
        !uploadFormRef.current.contains(event.target) &&
        !uploadButtonRef.current.contains(event.target)
      ) {
        setToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

    const fetchUserData = async () => {
      const res = await CurrentUser(user);
      if (res) {
        if (res.profilePic) {
          setUserImg(formatImagePath(res.profilePic));
        }
      }
    };

    fetchUserData();
  }, []);

  const toggleUploadForm = () => {
    setToggle((prev) => !prev);
  };

  return (
    status === "authenticated" && (
      <>
        <nav className=" lg:min-h-full lg:bg-none lg:bg-transparent lg:w-[15rem] lg:grid w-full flex items-center justify-center lg:relative bg-neutral-950 bg-[radial-gradient(ellipse_90%_80%_at_50%_95%,rgba(120,119,198,0.3),rgba(255,255,255,0))] py-3 md:py-8">
            <ul className="lg:space-y-20 space-x-4 lg:space-x-0 md:space-x-20 text-base md:text-3xl lg:text-xl lg:w-28 font-semibold lg:grid flex z-50">
              <li>
                <Link href="/" className=" flex items-center space-x-2"><div><Image className="lg:h-10 lg:w-10" src="/icons/home.png" height={20} width={20} alt="default Image"/></div><span>Home</span></Link>
              </li>
              <li>
                <Link href={`/profile/${session.user.id}`} className=" flex items-center space-x-2"><div><Image className="lg:h-10 lg:w-10" src={userImg} height={20} width={20} alt="default Image"/></div><span>Profile</span></Link>
              </li>
              <button
                onClick={toggleUploadForm}
                type="button"
                className="flex items-center space-x-2"
                ref={uploadButtonRef}
              >
                <div><Image className="lg:h-10 lg:w-10" src="/icons/upload.png" height={20} width={20} alt="default Image"/></div><span>Upload</span>
              </button>
              <button onClick={() => signOut()} className="flex items-center space-x-2"><div><Image className="lg:h-10 lg:w-10" src="/icons/power.png" height={20} width={20} alt="default Image"/></div><span>Logout</span></button>
            </ul>
          
        </nav>
        {toggle && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-slate-900/20 overflow-y-auto"
            ref={uploadFormRef}
          >
            <UploadForm toggle={toggle} setToggle={setToggle} />
          </div>
        )}
      </>
    )
  );
};

export default Navbar;
