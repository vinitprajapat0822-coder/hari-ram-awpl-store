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
  hoverScale = 1.012,
  noPress = false,
  ...rest
}: Props) {
  return (
    <motion.div
      whileHover={noPress ? undefined : { y: -3, scale: hoverScale }}
      whileTap={noPress ? undefined : { scale: 0.988 }}
      transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.7 }}
      onClick={onClick}
      className={cn("glass-card rounded-2xl", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
