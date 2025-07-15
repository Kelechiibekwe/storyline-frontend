"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal } from "lucide-react";

interface NavbarMobileDashboardProps {
  // e.g. title?: string
}

const NavbarMobileDashboard: React.FC<NavbarMobileDashboardProps> = ({}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback className="bg-blue-500 text-white">
              JD
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-gray-900">My Journal</h1>
            <p className="text-sm text-gray-500">john.doe@email.com</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-6">
        <button className="pb-2 border-b-2 border-blue-500 text-blue-600 font-medium">
          List
        </button>
        <button className="pb-2 text-gray-500 font-medium">Calendar</button>
        <button className="pb-2 text-gray-500 font-medium">Tags</button>
      </div>
    </div>
  );
};

export default NavbarMobileDashboard;
