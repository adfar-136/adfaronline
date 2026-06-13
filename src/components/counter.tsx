"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useTransform, animate } from "framer-motion";

export function Counter({ 
  value, 
  duration = 1.8,
  delay = 0.1
}: { 
  value: number; 
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, { 
        duration, 
        delay,
        ease: "easeOut"
      });
      return controls.stop;
    }
  }, [isInView, motionValue, value, duration, delay]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString();
      }
    });
  }, [rounded]);

  return <span ref={ref}>0</span>;
}
