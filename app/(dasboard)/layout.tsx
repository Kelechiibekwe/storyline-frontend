"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import NavbarMobileDashboard from "@/components/NavbarMobileDashboard";
import { useState, useEffect } from "react";

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Mobile View */}
      <header className="block md:hidden">
        <NavbarMobileDashboard />
      </header>
      {/* Desktop View */}
      <header className="hidden md:block">
        <Header />
      </header>
      <main className=" sm:pt-36 pb-4 sm:pb-16">{children}</main>
      <Footer />
    </div>
  );
}
