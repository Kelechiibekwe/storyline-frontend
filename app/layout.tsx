import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Playfair } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import SplashScreen from "@/components/splash-screen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair({
  variable: "--font-play-fair",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My StoryLog",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} !scroll-smooth`}
      >
        <head>
          <title>My StoryLog</title>
          <meta property="og:image" content="/capture_your_thoughts.png" />
        </head>
        <body
          className={`${inter.className} bg-gray-50 text-gray-950 relative`}
        >
          <SplashScreen duration={2500} />
          <div className="bg-[#fbe2e3] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem]"></div>
          <div className="bg-[#dbd7fb] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
          <main>
            <Providers>{children}</Providers>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
