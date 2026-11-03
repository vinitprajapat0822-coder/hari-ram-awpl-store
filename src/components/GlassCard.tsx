"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function GlassCard({ children, className, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-white/10 to-white/[0.02]",
        "backdrop-blur-[36px]",
        "border border-white/20",
        "shadow-[0_16px_40px_-4px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)]",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      {children}
    </motion.div>
  );
}
