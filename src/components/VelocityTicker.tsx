"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type TickerMotion = {
  duration: number;
  direction: "normal" | "reverse";
};

const tickerItems = [
  "🌱 Everyday wellness & care",
  "🚚 Delivery details confirmed on enquiry",
  "🛍️ 135 individual product listings",
  "📦 Separate pack-size listings",
];

export default function VelocityTicker() {
  const [motionStyle, setMotionStyle] = useState<TickerMotion>({
    duration: 27,
    direction: "normal",
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTimestamp = performance.now();
    let frameId = 0;
    let resetTimer = 0;

    const updateFromScroll = () => {
      if (frameId !== 0) return;

      frameId = window.requestAnimationFrame(() => {
        const now = performance.now();
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;
        const elapsed = Math.max(16, now - lastTimestamp);
        const velocity = Math.abs(delta) / elapsed;
        const duration = Math.max(10, Math.min(29, 29 - velocity * 8));

        if (delta !== 0) {
          setMotionStyle({
            duration,
            direction: delta > 0 ? "normal" : "reverse",
          });
        }

        lastScrollY = currentY;
        lastTimestamp = now;
        frameId = 0;

        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          setMotionStyle({ duration: 27, direction: "normal" });
        }, 420);
      });
    };

    window.addEventListener("scroll", updateFromScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      window.clearTimeout(resetTimer);
    };
  }, []);

  const style = {
    "--ticker-duration": motionStyle.duration + "s",
    "--ticker-direction": motionStyle.direction,
  } as CSSProperties;

  return (
    <div className="velocity-ticker" aria-label="Store information">
      <div className="velocity-ticker__track" style={style}>
        <div className="velocity-ticker__group">
          {tickerItems.map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="velocity-ticker__group" aria-hidden="true">
          {tickerItems.map((item) => <span key={"repeat-" + item}>{item}</span>)}
        </div>
      </div>
    </div>
  );
}
