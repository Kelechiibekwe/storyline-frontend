"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import NavbarMobileDashboard from "@/components/NavbarMobileDashboard";
import { useState, useEffect } from "react";
import BarLoader from "@/components/BarLoader";

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <BarLoader />
      </div> */}

      {/* Mobile View */}
      <header className="block md:hidden">
        <NavbarMobileDashboard />
      </header>
      {/* Desktop View */}
      <header className="hidden md:block">
        <Header />
      </header>
      <main className=" sm:pt-36 pb-4 sm:pb-16">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
