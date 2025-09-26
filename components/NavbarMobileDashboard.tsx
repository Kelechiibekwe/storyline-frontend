"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, ChevronsUpDown } from "lucide-react";
import StaggeredDropDown from "./staggered-dropdown";
import { useClerk, useUser } from "@clerk/nextjs";

interface NavbarMobileDashboardProps {
  // e.g. title?: string
}

const dropdownVariants = {
  open: { opacity: 1, y: 0, pointerEvents: "auto" },
  closed: { opacity: 0, y: -10, pointerEvents: "none" },
};

const links = [
  { name: "Journal", hash: "/journal" },
  { name: "Stories", hash: "/podcast" },
];

const NavbarMobileDashboard: React.FC<NavbarMobileDashboardProps> = ({}) => {
  const [activeSection, setActiveSection] = useState("Journal");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const clerk = useClerk();
  const { user } = useUser();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between mb-4">
        <div className=" flex flex-row items-center gap-2">
          <div
            onClick={() => setProfileMenuOpen((pv) => !pv)}
            className="flex items-center cursor-pointer gap-3 relative overflow-visible"
          >
            <div>
              <Avatar className="w-10 h-10 ">
                <AvatarImage
                  src={user?.imageUrl || "/avatar.png"}
                  alt="User profile image"
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <motion.div
                // variants={dropdownVariants}
                initial="closed"
                animate={profileMenuOpen ? "open" : "closed"}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-1 mt-2 z-50"
              >
                <StaggeredDropDown
                  open={profileMenuOpen}
                  setOpen={setProfileMenuOpen}
                />
              </motion.div>
            </div>
            {user ? (
              <div>
                <div className="flex flex-row gap-2">
                  <h1 className="font-semibold text-gray-900">
                    {(user.firstName || user.username) + "'s Journal"}
                  </h1>
                  <div className="flex items-center">
                    <ChevronsUpDown size={16.5} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {user.primaryEmailAddress?.emailAddress ||
                    user.emailAddresses?.[0]?.emailAddress}
                </p>
              </div>
            ) : (
              <div>
                <h1 className="font-semibold text-gray-900">Journal</h1>
              </div>
            )}
          </div>
        </div>
        {/* <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback className="bg-blue-500 text-white">
              JD
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-gray-900">My Journal</h1>
            <p className="text-sm text-gray-500">john.doe@email.com</p>
          </div>
        </div> */}
        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="icon" className="w-9 h-9">
            <Search className="w-5 h-5" />
          </Button> */}
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="">
        <ul className="flex gap-6 font-medium text-gray-500">
          {links.map((link) => (
            <motion.li
              className="h-3/4 flex items-center justify-center relative"
              key={link.hash}
              // initial={{ y: -100, opacity: 0 }}
              // animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className={clsx(
                  "flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition",
                  { "text-gray-950": activeSection === link.name }
                )}
                href={link.hash}
                onClick={() => setActiveSection(link.name)}
              >
                {link.name}
                {link.name === activeSection && (
                  <motion.span
                    className="border-b-2 border-gray-950 absolute inset-0 !-z-999"
                    // className="bg-gray-200 rounded-full absolute inset-0 -z-10"
                    layoutId="activeSection"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  ></motion.span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavbarMobileDashboard;
