"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Twitter, Facebook, Instagram, Linkedin, Menu, X } from "lucide-react"
import { useState } from "react"
import Header from "@/components/header-home";
import Features from "@/components/features";
import Footer from "@/components/footer"
import DotExpandButton from "@/components/button"
import { FiArrowRight } from "react-icons/fi";
import StickyCards from "@/components/sticky-cards"
import TextParallaxContentExample from "@/components/text-parallel-content"
import {motion} from "framer-motion";
import FeatureShowcase from "@/components/feature-showcase"
import { ChevronDown, ChevronUp } from "lucide-react"
import CollapseCardFeatures from "@/components/collapsed-features"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <motion.div 
          initial={{opacity:0, y:40}}
          animate={{opacity:1, y:0}}
          transition={{duration:0.5}}
          className="flex-1">
        <HeroSection />
        <CollapseCardFeatures/>
      </motion.div>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section
      id="hero"
      // className="w-full py-20 sm:py-24 lg:py-32 xl:py-48"
      className="w-full py-20 sm:py-24 lg:py-32 xl:py-48"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          
          {/* Left column: headline, description, buttons */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Capture Your Thoughts, Discover Your Story
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Storyline is your personal journaling companion — helping you
                reflect, grow, and stay mindful, one entry at a time.
              </p>
            </div>

            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/login"
                className="group flex h-10 items-center gap-2 rounded-full bg-gray-900 text-white px-4 transition-all duration-300 ease-in-out hover:bg-white hover:px-2 hover:text-black active:bg-neutral-200"
              >
                <span className="rounded-full bg-white p-1 text-sm transition-colors duration-300 group-hover:bg-black">
                  <FiArrowRight className="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-white group-active:-rotate-45" />
                </span>
                <span>Get Started for Free</span>
              </Link>

              <Link
                href="#demo"
                className="group flex h-10 items-center gap-2 rounded-full bg-white px-4 transition-all duration-300 ease-in-out hover:bg-black hover:px-2 hover:text-white active:bg-neutral-700"
              >
                <span className="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-white">
                  <FiArrowRight className="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-black group-active:-rotate-45" />
                </span>
                <span>Learn More</span>
              </Link>
            </div>
          </div>

          {/* Right column: illustration image */}
          <div>
            <Image
              src="/exams-Illustration.svg"
              width={550}
              height={550}
              alt="Relaxed individual writing in a notebook at a desk"
              className="mx-auto overflow-visible rounded-xl sm:w-full lg:order-last"
            />
          </div>

        </div>
      </div>
      
    </section>
  );
}

function BouncingArrow() {
  return (
    <div className="flex justify-center w-full sm:py-2 md:py-4 lg:py-8">
      <div className="bg-primary/10 rounded-full p-1">
          <ChevronDown className="h-6 w-6 text-primary" />
      </div>
    </div>
  )
}