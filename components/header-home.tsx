"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import clsx from "clsx"
import Image from "next/image"

const links = [
  { name: "Home", hash: "#home" },
  { name: "Features", hash: "#features" },
]

export default function Header() {
  return (
    <header className="z-[999] relative">
      <motion.div
        className="fixed top-0 left-1/2 h-[3.25rem] w-[22rem] rounded-full border border-white border-opacity-40 bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
      ></motion.div>

      <nav className="flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0">
        <ul className="flex w-[14rem] items-center justify-center gap-x-3 text-[0.9rem] font-medium text-gray-500">
          <Logo />
          {links.map((link) => (
            <motion.li
              className="h-3/4 flex items-center justify-center relative"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className={clsx("flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition")}
                href={link.hash}
              >
                {link.name}
              </Link>
            </motion.li>
          ))}
        <motion.li
          key="special"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Link
            href="/journal"
            className="flex items-center justify-center h-10 px-6 bg-gray-900 shadow-md rounded-full text-white transition hover:bg-gray-700"
          >
            Login
          </Link>
        </motion.li>
        </ul>
      </nav>
    </header>
  )
}

const Logo = () => {
  // Temp logo from https://logoipsum.com/
  return (
    <Image
    src="/logo.svg"
    width={25}
    height={25}
    alt="Relaxed individual writing in a notebook at a desk"
    // className="mx-auto overflow-visible rounded-xl sm:w-full lg:order-last"
  />
  );
};

