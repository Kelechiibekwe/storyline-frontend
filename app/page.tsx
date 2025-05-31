"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Twitter, Facebook, Instagram, Linkedin, Menu, X } from "lucide-react"
import { useState } from "react"
import Header from "@/components/header-home";
import Features from "@/components/features";
import Footer from "@/components/footer"


export default function LandingPage() {

  
  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="flex-1">
        <HeroSection />
        <Features />
      </main>
      <Footer />
    </div>
  )
}



function HeroSection() {
  return (
    <section id="hero" className="w-full py-20 sm:py-24 lg:py-32 xl:py-48">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Capture Your Thoughts, Discover Your Story
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Storyline is your personal journaling companion — helping you reflect, grow, and 
                stay mindful, one entry at a time.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="h-10 px-6 rounded-full bg-gray-900 hover:bg-gray-700">
                <Link href="#get-started">Get Started for Free</Link>
              </Button>
              <Button variant="outline" size="lg" className="h-10 px-6 rounded-full ">
                <Link href="#demo">Learn More</Link>
              </Button>
            </div>
          </div>
          <Image
            src="/exams-Illustration.svg"
            width={550}
            height={550}
            alt="Relaxed individual writing in a notebook at a desk"
            className="mx-auto overflow-visible rounded-xl sm:w-full lg:order-last"
          />
        </div>
      </div>
    </section>
  )
}
