"use client";

import Image from "next/image";
import { MotionConfig, motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { FiMenu, FiArrowRight } from "react-icons/fi";
import Hamburger from "hamburger-react";

const FlipNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeOpenMenu = (e: MouseEvent) => {
      const target = e.target as Node;
      if (isOpen && menuRef.current && !menuRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", closeOpenMenu);
    return () => {
      document.removeEventListener("click", closeOpenMenu);
    };
  }, [isOpen]);

  return (
    <nav
      className="shadow-black/[0.03] 
          backdrop-blur-[0.5rem] border 
          border-white 
          shadow-lg fixed top-0 left-0 w-full 
          z-[1000] h-[3.5rem] px-4 py-2
         bg-white/80 sm:hidden flex items-center justify-between"
    >
      <p className="font-bold text-gray-900">My StoryLog</p>
      <NavRight isOpen={isOpen} setIsOpen={setIsOpen} />
      <NavMenu isOpen={isOpen} menuRef={menuRef} />
    </nav>
  );
};

const NavRight = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center gap-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="block text-gray-950"
        // onClick={() => setIsOpen((pv) => !pv)}
      >
        <Hamburger size={21} toggled={isOpen} toggle={setIsOpen} />

        {/* <FiMenu /> */}
      </motion.button>
    </div>
  );
};

const NavMenu = ({
  isOpen,
  menuRef,
}: {
  isOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <motion.div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className="absolute isolate px-4 py-2 bg-white shadow-lg shadow-black/[0.03] bg-opacity-80 backdrop-blur-[0.5rem] left-0 right-0 top-full origin-top flex flex-col gap-4"
      // className="absolute p-4 border-white border-opacity-40 bg-white shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] left-0 right-0 top-full origin-top flex flex-col gap-4"
    >
      <MenuLink text="Home" href="#hero" />
      <MenuLink text="Features" href="#features" />
      <MenuLink text="Login" href="/sign-in" />
    </motion.div>
  );
};

const MenuLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <motion.a
      variants={menuLinkVariants}
      rel="nofollow"
      href={href}
      className="h-[30px] overflow-hidden font-medium flex items-start gap-2"
    >
      <div>
        <span className="flex items-center h-[30px] hover:text-indigo-600">
          {text}
        </span>
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
