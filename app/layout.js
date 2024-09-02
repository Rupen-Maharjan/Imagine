import "./globals.css";
import SessionWrapper from "@/sessionWrapper/SessionWrapper";
import { connectDb } from "@/functions/export";
import { Navbar } from "@/components/export";
import { Logo } from "@/components/export";

export const metadata = {
  title: "Imagina",
  description: "Let your imagination run wild.",
};

export default async function RootLayout({ children }) {
  await connectDb();


  return (
    <html lang="en">
      <body className=" text-white h-screen w-screen relative overflow-x-hidden bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_80%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <SessionWrapper>
          <div className=" flex flex-col lg:flex-row justify-center items-center relative h-full">
            <Logo/>
<div className="hidden lg:block">
            <Navbar />
</div>

            {children}
            <div className=" block lg:hidden w-full">
            <Navbar />
</div>

          </div>

        </SessionWrapper>
      </body>
    </html>
  );
}
