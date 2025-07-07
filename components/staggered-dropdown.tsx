import {
    FiEdit,
    FiChevronDown,
    FiTrash,
    FiSettings,
    FiLogOut,
    FiShare,
    FiPlusSquare,
  } from "react-icons/fi";
  import React, { useCallback } from "react"
  import { LogOut, MoveUpRight, Settings, CreditCard, FileText } from "lucide-react"
  import { motion } from "framer-motion";
  import { Dispatch, SetStateAction, useState } from "react";
  import { IconType } from "react-icons";

  type StaggeredDropDownProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
  

  const StaggeredDropDown = ({ open, setOpen }: StaggeredDropDownProps) => {

    const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL || "http://127.0.0.1:5000";
    const handleLogOut = useCallback(() => {
      window.location.href = `${apiUrl}/logout`;
    }, [apiUrl]);
  
    return (
      <div className="flex p-2 items-center justify-center">
        <motion.div animate={open ? "open" : "closed"} className="relative">
          {/* <button
            onClick={() => setOpen((pv) => !pv)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-indigo-50 bg-indigo-500 hover:bg-indigo-500 transition-colors"
          >
            <span className="font-medium text-sm">Post actions</span>
            <motion.span variants={iconVariants}>
              <FiChevronDown />
            </motion.span>
          </button> */}
  
          <motion.ul
            initial={wrapperVariants.closed}
            variants={wrapperVariants}
            style={{ originY: "top", translateX: "-10%" }}
            className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] left-[50%] w-48 overflow-hidden"
          >
            <p className="text-xs p-2 text-muted-foreground border-b border-border">Default username</p>
            {/* <div className="border-t border-border my-1" /> */}
            {/* <Option setOpen={setOpen} Icon={FiPlusSquare} text="Duplicate" /> */}
            <Option setOpen={setOpen} Icon={FiSettings} text="Settings" />
            <Option setOpen={setOpen} Icon={FiLogOut} text="Logout" onClick={handleLogOut}/>
          </motion.ul>
        </motion.div>
      </div>
    );
  };
  
  const Option = ({
    text,
    Icon,
    setOpen,
    onClick,
  }: {
    text: string;
    Icon: IconType;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onClick?: () => void;
  }) => {
    return (
      <motion.li
        variants={itemVariants}
        onClick={() => 
            {setOpen(false);
            onClick?.();}}
        className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
      >
        <motion.span variants={actionIconVariants}>
          <Icon />
        </motion.span>
        <span>{text}</span>
      </motion.li>
    );
  };
  
  export default StaggeredDropDown;
  
  const wrapperVariants = {
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
  
  const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };
  
  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
      },
    },
    closed: {
      opacity: 0,
      y: -15,
      transition: {
        when: "afterChildren",
      },
    },
  };
  
  const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
  };