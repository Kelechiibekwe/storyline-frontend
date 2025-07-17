"use client";
import React from "react";
import Magnet from "./magnet";
import { useMediaQuery } from "@/hooks/use-media-querry";

export default function Footer() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <footer className="mb-10 p-4 text-center text-gray-500">
      <Magnet padding={50} disabled={!isDesktop} magnetStrength={2}>
        <p className="text-xs">
          <span className="font-semibold">Built By </span>
          <a
            href="https://kelechiibekwe.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Kelechi Ibekwe
          </a>{" "}
          using lots of willpower.
        </p>
      </Magnet>
    </footer>
  );
}
