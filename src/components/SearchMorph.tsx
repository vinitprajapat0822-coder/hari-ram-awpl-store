"use client";

import { useEffect, useState } from "react";

const SEARCH_PROMPTS = [
  "Search 'DENTODOC CREAM'...",
  "Search 'SNISS Elite'...",
  "Search 'BATHVEDA'...",
  "Search by product or pack size...",
];

export function useSearchMorphPlaceholder() {
  const [placeholder, setPlaceholder] = useState(SEARCH_PROMPTS[0] ?? "Search products...");

  useEffect(() => {
    let promptIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timerId = 0;

    const tick = () => {
      const prompt = SEARCH_PROMPTS[promptIndex] ?? "Search products...";
      characterIndex += deleting ? -1 : 1;
      setPlaceholder(prompt.slice(0, Math.max(0, characterIndex)));

      let delay = deleting ? 30 : 58;
      if (!deleting && characterIndex >= prompt.length) {
        deleting = true;
        delay = 1250;
      } else if (deleting && characterIndex <= 0) {
        deleting = false;
        promptIndex = (promptIndex + 1) % SEARCH_PROMPTS.length;
        delay = 220;
      }

      timerId = window.setTimeout(tick, delay);
    };

    timerId = window.setTimeout(tick, 650);
    return () => window.clearTimeout(timerId);
  }, []);

  return placeholder;
}
