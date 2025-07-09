"use client"

import Image from "next/image"
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { FiMenu, FiArrowRight } from "react-icons/fi";

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

const FlipNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] p-4 sm:hidden flex items-center justify-between">
      <p className="font-bold text-gray-900">My StoryLog</p>
      <NavRight setIsOpen={setIsOpen} />
      <NavMenu isOpen={isOpen} />
    </nav>
  );
};

const NavRight = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center gap-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="block text-gray-950 text-2xl"
        onClick={() => setIsOpen((pv) => !pv)}
      >
        <FiMenu />
      </motion.button>
    </div>
  );
};


const NavMenu = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <motion.div
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className="absolute p-4 bg-white shadow-lg shadow-black/[0.03] bg-opacity-80 backdrop-blur-[0.5rem] left-0 right-0 top-full origin-top flex flex-col gap-4"
      // className="absolute p-4 border-white border-opacity-40 bg-white shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] left-0 right-0 top-full origin-top flex flex-col gap-4"
    >
      <MenuLink text="Home" href="#home"/>
      <MenuLink text="Features" href="#features"/>
      <MenuLink text="Login" href="/sign-in"/>
    </motion.div>
  );
};

const MenuLink = ({ text, href }: { text: string, href:string }) => {
  return (
    <motion.a 
      variants={menuLinkVariants}
      rel="nofollow"
      href={href}
      className="h-[30px] overflow-hidden font-medium flex items-start gap-2"
    >
      <div >
        <span className="flex items-center h-[30px] text-gray-500 hover:text-indigo-600">{text}</span>
      </div>
    </motion.a>
  );
};

export default FlipNav;

const menuVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const menuLinkVariants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: -10,
    opacity: 0,
  },
};


const menuLinkArrowVariants = {
  open: {
    x: 0,
  },
  closed: {
    x: -4,
  },
};