import React from "react";

export default function Footer() {
  return (
    <footer className="mb-10 px-4 text-center text-gray-500">
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
    </footer>
  );
}