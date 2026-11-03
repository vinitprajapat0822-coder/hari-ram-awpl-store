"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverScale?: number;
  noPress?: boolean;
} & HTMLMotionProps<"div">;

export default function GlassCard({
  children,
  className,
  onClick,
  hoverScale = 1.015,
  noPress = false,
  ...rest
}: Props) {
  return (
    <motion.div
      whileHover={noPress ? undefined : { scale: hoverScale }}
      whileTap={noPress ? undefined : { scale: 0.975 }}
      transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.6 }}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-white/[0.11] via-white/[0.04] to-white/[0.02]",
        "backdrop-blur-[40px] saturate-[1.3]",
        "border border-white/[0.14]",
        "shadow-[0_16px_40px_-6px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18)]",
        className
      )}
      {...rest}
    >
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.4) 35%, rgba(255,255,255,0.2) 65%, transparent 95%)",
        }}
      />
      {children}
    </motion.div>
  );
}
