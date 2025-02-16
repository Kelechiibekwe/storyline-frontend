"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Check, Sun, Moon, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"
import { cn } from "@/utils/cn"

export default function SaveButton() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [bounce, setBounce] = useState(false)

  const userId = 1;

  const handleSave = async () => {
    if (status === "idle") {
      setStatus("saving");

      try {
        const response = await fetch(`http://127.0.0.1:5000/v1/podcasts/${userId}`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Podcast generated:", data);

        setStatus("saved");
        setBounce(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ffff00",
            "#00ffff",
            "#ff00ff",
          ],
          shapes: ["star", "circle"],
        });
      } catch (error) {
        console.error("Error generating podcast:", error);
        setStatus("idle");
      } finally {
        setTimeout(() => {
          setStatus("idle");
          setBounce(false);
        }, 2000);
      }
    }
  };

  const buttonVariants = {
    idle: {
      backgroundColor: "rgb(243, 244, 246)",
      color: "black",
      scale: 1,
    },
    saving: {
      backgroundColor: "rgb(59, 130, 246)",
      color: "white",
      scale: 1,
    },
    saved: {
      backgroundColor: "rgb(34, 197, 94)",
      color: "white",
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.2,
        times: [0, 0.5, 1],
      },
    },
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 transition-colors duration-300 `}
    >
      <div className="relative">
        <div className="relative">
          <motion.button
            onClick={handleSave}
            animate={status}
            variants={buttonVariants}
            className={cn(
              "group relative grid overflow-hidden rounded-full px-6 py-2 transition-all duration-200",
              status === "idle"
                ? "shadow-[0_1000px_0_0_hsl(0_0%_85%)_inset] dark:shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset]"
                : "",
              "hover:shadow-lg",
            )}
            style={{ minWidth: "150px" }}
            whileHover={status === "idle" ? { scale: 1.05 } : {}}
            whileTap={status === "idle" ? { scale: 0.95 } : {}}
          >
            {status === "idle" && (
              <span>
                <span
                  className={cn(
                    "spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full",
                    "[mask:linear-gradient(black,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,black_360deg)]",
                    "before:rotate-[-90deg] before:animate-rotate dark:before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)]",
                    "before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%] dark:[mask:linear-gradient(white,_transparent_50%)]",
                  )}
                />
              </span>
            )}
            <span
              className={cn(
                "backdrop absolute inset-px rounded-[22px] transition-colors duration-200",
                status === "idle"
                  ? "bg-neutral-100 group-hover:bg-neutral-200 dark:bg-neutral-950 dark:group-hover:bg-neutral-900"
                  : "",
              )}
            />
            <span className="z-10 flex items-center justify-center gap-2 text-sm font-medium">
              <AnimatePresence mode="wait">
                {status === "saving" && (
                  <motion.span
                    key="saving"
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 1, rotate: 360 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      rotate: { repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" },
                    }}
                  >
                    <Loader2 className="w-4 h-4" />
                  </motion.span>
                )}
                {status === "saved" && (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {status === "idle" ? "Generate podcast!" : status === "saving" ? "Working on it..." : "Podcast ready!"}
              </motion.span>
            </span>
          </motion.button>
          <AnimatePresence>
            {bounce && (
              <motion.div
                className="absolute top-0 right-0 -mr-1 -mt-1"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={sparkleVariants}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

