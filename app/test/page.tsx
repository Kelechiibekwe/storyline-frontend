"use client"

import Image from "next/image"
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { FiMenu, FiArrowRight } from "react-icons/fi";

const FlipNavWrapper = () => {
  return (
    <div className="">
      <FlipNav />
    </div>
  );
};

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
    <nav className=" p-4 sm:hidden flex items-center border-white border-opacity-40 bg-white bg-opacity-80 bg-opacity-80  shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] justify-between relative">
      <Logo />
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
      className="absolute p-4 bg-white shadow-lg border-white border-opacity-40 bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] left-0 right-0 top-full origin-top flex flex-col gap-4"
    >
      <MenuLink text="Home" />
      <MenuLink text="Features" />
      <MenuLink text="Login" />
    </motion.div>
  );
};

const MenuLink = ({ text }: { text: string }) => {
  return (
    <motion.a 
      variants={menuLinkVariants}
      rel="nofollow"
      href="#"
      className="h-[30px] overflow-hidden font-medium flex items-start gap-2"
    >
      <div >
        <span className="flex items-center h-[30px] text-gray-500 hover:text-indigo-600">{text}</span>
      </div>
    </motion.a>
  );
};

export default FlipNavWrapper;

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