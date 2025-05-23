"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Twitter, Facebook, Instagram, Linkedin, Menu, X } from "lucide-react"
import { useState } from "react"
import Header from "@/components/header-home";
import Features from "@/components/features";


export default function LandingPage() {

  
  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="flex-1">
        <HeroSection />
        <Features />
        {/* <TestimonialsSection /> */}
        {/* <PricingSection /> */}
        {/* <CtaSection /> */}
      </main>
      {/* <Footer /> */}
    </div>
  )
}



function HeroSection() {
  return (
    <section id="hero" className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
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

function FeaturesSection() {
  const features = [
    {
      title: "Workflow Automation",
      description: "Automate repetitive tasks and workflows to save time and reduce errors.",
      icon: "/placeholder.svg?height=48&width=48",
    },
    {
      title: "Team Collaboration",
      description: "Real-time collaboration tools that keep your team connected and productive.",
      icon: "/placeholder.svg?height=48&width=48",
    },
    {
      title: "Advanced Analytics",
      description: "Gain insights into your team's performance with detailed analytics and reports.",
      icon: "/placeholder.svg?height=48&width=48",
    },
    {
      title: "Seamless Integration",
      description: "Connect with your favorite tools and services for a unified workflow experience.",
      icon: "/placeholder.svg?height=48&width=48",
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              StreamLine provides powerful tools designed to help your team work smarter, not harder.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start gap-4 rounded-lg border p-6 bg-background shadow-sm">
              <Image
                src={feature.icon || "/placeholder.svg"}
                width={48}
                height={48}
                alt={feature.title}
                className="rounded-md"
              />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "StreamLine has transformed how our team works. We've cut our project delivery time in half!",
      author: "Sarah Johnson",
      role: "Product Manager, TechCorp",
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      quote:
        "The automation features alone have saved us countless hours of manual work. Absolutely worth every penny.",
      author: "Michael Chen",
      role: "CTO, GrowthStartup",
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      quote: "Our team collaboration has improved dramatically since we started using StreamLine. Highly recommended!",
      author: "Emily Rodriguez",
      role: "Team Lead, InnovateDesign",
      avatar: "/placeholder.svg?height=64&width=64",
    },
  ]

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Teams Worldwide</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don't just take our word for it. See what our customers have to say about StreamLine.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col justify-between rounded-lg border p-6 shadow-sm">
              <div className="space-y-4">
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    width={64}
                    height={64}
                    alt={testimonial.author}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      description: "Perfect for individuals and small teams just getting started.",
      features: ["Up to 5 team members", "Basic workflow automation", "Standard support", "1GB storage"],
    },
    {
      name: "Professional",
      price: "$29",
      description: "Ideal for growing teams that need more power and flexibility.",
      features: [
        "Up to 20 team members",
        "Advanced automation",
        "Priority support",
        "10GB storage",
        "Advanced analytics",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For large organizations with complex needs and dedicated support.",
      features: [
        "Unlimited team members",
        "Custom workflow solutions",
        "24/7 dedicated support",
        "Unlimited storage",
        "Advanced security features",
        "Custom integrations",
      ],
    },
  ]

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that's right for your team. All plans include a 14-day free trial.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-lg border p-6 shadow-sm ${
                plan.popular ? "border-primary bg-background relative" : "bg-background"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                  Most Popular
                </div>
              )}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <div className="mt-6 space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.popular ? "bg-primary text-primary-foreground" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section id="get-started" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Transform Your Workflow?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of teams that use StreamLine to boost productivity and streamline collaboration.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" className="gap-1">
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="StreamLine Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-xl font-bold">StreamLine</span>
            </Link>
            <p className="text-sm text-muted-foreground">Empowering teams to work smarter, not harder.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} StreamLine. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
