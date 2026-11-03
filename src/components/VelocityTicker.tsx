"use client";

import { useEffect, useRef } from "react";

const tickerItems = [
  "🌱 Everyday wellness & care",
  "🚚 Delivery details confirmed on enquiry",
  "🛍️ 135 individual product listings",
  "📦 Separate pack-size listings",
];

export default function VelocityTicker() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTimestamp = performance.now();
    let frameId = 0;
    let resetTimer = 0;

    const setTickerMotion = (duration: number, direction: "normal" | "reverse") => {
      const track = trackRef.current;
      if (!track) return;
      track.style.setProperty("--ticker-duration", duration + "s");
      track.style.setProperty("--ticker-direction", direction);
    };

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
          setTickerMotion(duration, delta > 0 ? "normal" : "reverse");
        }

        lastScrollY = currentY;
        lastTimestamp = now;
        frameId = 0;

        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          setTickerMotion(27, "normal");
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

  return (
    <div className="velocity-ticker" role="group" aria-label="Store information">
      <div
        ref={trackRef}
        className="velocity-ticker__track"
        style={{
          "--ticker-duration": "27s",
          "--ticker-direction": "normal",
        } as React.CSSProperties}
      >
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
