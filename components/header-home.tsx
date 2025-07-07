"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import clsx from "clsx"
import Image from "next/image"
import FlipNav from "./flip-nav"
import { useState } from "react"
import { useCallback } from "react"


const links = [
  { name: "Home", hash: "#home" },
  { name: "Features", hash: "#features" },
]



export default function Header() {
  const [activeSection, setActiveSection] = useState("Home");


  const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL || "http://127.0.0.1:5000";
  const handleLogin = useCallback(() => {
    window.location.href = `${apiUrl}/login`;
  }, [apiUrl]);

  return (
    <header className="z-[999] relative">
      <motion.div
        className="fixed top-0 left-1/2 -translate-x-1/2 h-[10rem] w-full rounded-none border 
          border-white border-opacity-40 bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] 
          backdrop-blur-[0.5rem] sm:top-6 sm:w-[22rem] sm:h-[3.25rem] sm:rounded-full"
        // initial={{ y: -100, x: "-50%", opacity: 0 }}
        // animate={{ y: 0, x: "-50%", opacity: 1 }}
      ></motion.div>

      <nav className="hidden sm:flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0">
        <ul className="flex w-[14rem] items-center justify-center gap-x-3 text-[0.9rem] font-medium text-gray-500">
          {links.map((link) => (
            <motion.li
              className="h-3/4 flex items-center justify-center relative"
              key={link.hash}
              // initial={{ y: -100, opacity: 0 }}
              // animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className={clsx("flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition",{"text-gray-950":activeSection === link.name,})}
                href={link.hash}
                onClick={() => setActiveSection(link.name)}
              >
                {link.name}
                { link.name === activeSection && (
                <motion.span 
                  className="bg-gray-200 rounded-full absolute inset-0 -z-10"
                  layoutId="activeSection"
                  transition={{
                    // type: "spring",
                    // stiffness: 380,
                    // damping: 30
                  }}
                  ></motion.span>)
                }
              </Link>
            </motion.li>
          ))}
        <motion.li
          key="special"
          // initial={{ y: -100, opacity: 0 }}
          // animate={{ y: 0, opacity: 1 }}
        >
          <button
            onClick={handleLogin}
            className="flex items-center justify-center h-10 px-6 bg-gray-900 shadow-md rounded-full text-white transition hover:bg-gray-700"
          >
            Login
          </button>
        </motion.li>
        </ul>
      </nav>
      {/* <nav className="fixed">something</nav> */}
      <FlipNav/>
    </header>
  )
}

