"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PanelRightOpen, X } from 'lucide-react';
import { useState } from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import clsx from "clsx"
import Image from "next/image"
import { AnimatePresence } from "framer-motion";

const sidebarVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.4}}
};

const links = [
  { name: "Journal", hash: "/journal" },
  { name: "Stories", hash: "/podcast" },
]

export default function Header() {

  const [activeSection, setActiveSection] = useState("Journal");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = () => {
    setMenuOpen(!menuOpen);
  }

  return (
    <header className="z-[999] relative">
          <motion.div
            className="fixed top-0 left-1/2 h-[3.25rem] w-full sm:w-[16rem] sm:rounded-full border border-white border-opacity-40 bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6"
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
          ></motion.div>
          <div className="fixed top-[0.15rem] w-full flex items-center h-12 px-4 sm:px-6 sm:top-[1.7rem] sm:h-[initial]">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <nav className="mx-auto left-1/2 flex py-2 sm:py-0">
            <ul className="flex w-[14rem] items-center justify-center gap-x-3 text-[0.9rem] font-medium text-gray-500">
              {links.map((link) => (
                <motion.li
                  className="h-3/4 flex items-center justify-center relative"
                  key={link.hash}
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
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
                        type: "spring",
                        stiffness: 380,
                        damping: 30
                      }}
                      ></motion.span>)
                    }
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          {/* Right: Icon or spacer */}
        <div className="w-[40px] h-[40px] lg:block hidden">
        </div>

        <div onClick={handleNav} className="flex items-center lg:hidden cursor-pointer"> 
          <PanelRightOpen size={40}/>
        </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
              className="fixed right-0 top-0 w-full lg:hidden h-screen bg-white p-10 z-50"
            >
              <div className="flex w-full items-center justify-start ">
                <div onClick={handleNav} className="cursor-pointer">
                  <X />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </header>
  )
}

