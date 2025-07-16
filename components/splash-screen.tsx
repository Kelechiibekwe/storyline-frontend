// components/SplashScreen.tsx
"use client";
import { useEffect, useState } from "react";
import BlurText from "./blur-text";

export default function SplashScreen({
  duration = 3000, // how long (ms) the intro stays
}: {
  duration?: number;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // after `duration` ms, hide the intro
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      {/* your logo or animation */}
      <BlurText
        text="My Storylog"
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="text-2xl font-bold mb-8"
      />
      {/* <p className="text-4xl">My StoryLog</p> */}
    </div>
  );
}
