"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ArrowRight,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  X,
} from "lucide-react";

import Reveal from "@/components/utils/Reveal";

import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);
import { useState, useRef } from "react";
import Header from "@/components/header-home";
import Features from "@/components/features";
import Footer from "@/components/footer";
import DotExpandButton from "@/components/button";
import { FiArrowRight } from "react-icons/fi";
import StickyCards from "@/components/sticky-cards";
import TextParallaxContentExample from "@/components/text-parallel-content";
import FeatureShowcase from "@/components/feature-showcase";
import { ChevronDown, ChevronUp } from "lucide-react";
import CollapseCardFeatures from "@/components/collapsed-features";
import { Box } from "@/components/spinning-box";
import { ArrowDown } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import TrueFocus from "@/components/true-focus";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      > */}
      <HeroSection />
      <AboutSection />
      <CollapseCardFeatures />
      {/* </motion.div> */}
      <Footer />
    </div>
  );
}

function HeroSection() {
  const scrollToAbout = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // className="w-full py-20 sm:py-24 lg:py-32 xl:py-48"
      className="relative grid min-h-screen place-content-center overflow-hidden px-4 py-24"
    >
      {/* <div className="container mx-auto px-4 md:px-6"> */}
      {/* <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"> */}

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* <div className="space-y-4 md:space-y-6 text-center"> */}
        <span className="inline-block rounded-full bg-green-600/50 px-3 py-1.5 text-green-900 text-sm">
          Beta Now Live!
        </span>
        <h1 className="flex flex-col items-center justify-center text-center text-4xl sm:text-6xl font-bold tracking-tight gap-2">
          <span>Capture Your Thoughts,</span>
          <span className="inline-flex items-center justify-center gap-2 flex-col sm:flex-row">
            <span>Discover Your</span>
            <Box front="Story" back="Voice" top="Path" bottom="Self" />
          </span>
        </h1>

        <p className="mx-auto max-w-[650px] text-muted-foreground text-center md:text-xl">
          My StoryLog is your personal journaling companion — helping you
          reflect, grow, and stay mindful, one entry at a time.
        </p>
      </div>

      <div className="mt-6 flex gap-3 justify-center">
        <Link
          href="/sign-in"
          className="group flex h-10 items-center gap-2 rounded-full bg-gray-900 text-white px-4 transition-all duration-300 ease-in-out hover:bg-gray-200 hover:px-2 hover:text-black active:bg-neutral-200"
        >
          <span className="rounded-full bg-white p-1 text-sm transition-colors duration-300 group-hover:bg-black">
            <FiArrowRight className="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-white group-active:-rotate-45" />
          </span>
          <span>Get Started for Free</span>
        </Link>

        {/* <Link
                href="#demo"
                className="group flex h-10 items-center gap-2 rounded-full bg-white px-4 transition-all duration-300 ease-in-out hover:bg-black hover:px-2 hover:text-white active:bg-neutral-700"
              >
                <span className="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-white">
                  <FiArrowRight className="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-black group-active:-rotate-45" />
                </span>
                <span>Learn More</span>
              </Link> */}
      </div>
      {/* </div> */}

      {/* Right column: illustration image */}
      {/* <div>
            <Image
              src="/exams-Illustration.svg"
              width={550}
              height={550}
              alt="Relaxed individual writing in a notebook at a desk"
              className="mx-auto overflow-visible rounded-xl sm:w-full lg:order-last"
            />
          </div> */}

      {/* </div> */}
      {/* </div> */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToAbout}
          className="animate-bounce"
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
      </motion.div>
    </motion.section>
  );
}

function AboutSection() {
  return (
    <div className="info relative flex gap-4 justify-center px-4 py-24 sm:px-[20rem] items-center flex-wrap max-w-fit mx-auto">
      <div className="text-[1.75rem] sm:text-[2.5rem] leading-tight sm:leading-[3.5rem] font-medium">
        <Reveal>
          <p>
            Life rushes by in fragments, barely noticed, barely felt. But
            there’s meaning tucked inside the blur.
            <br />
            <br />
          </p>
        </Reveal>
        <Reveal>
          <p>
            MyStoryLog helps you slow down and listen. Speak your thoughts,
            follow gentle prompts, and rediscover your voice, one entry at a
            time. It’s not about writing more. It’s about feeling more.
            <br />
            <br />
          </p>
        </Reveal>
        <Reveal>
          <p>Welcome to the new rhythm of reflection.</p>
        </Reveal>
      </div>
    </div>
  );
}
