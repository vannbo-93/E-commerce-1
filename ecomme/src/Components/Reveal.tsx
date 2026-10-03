/** @format */

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; delay?: number };

export default function Reveal({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // من فعّل "تقليل الحركة" في نظامه يرى المحتوى مباشرة ودائمًا
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
        } else if (entry.boundingClientRect.top > 0) {
          // خرج من أسفل الشاشة (المستخدم صعد): يختفي ليظهر من جديد عند النزول
          setVisible(false);
        }
        // خرج من الأعلى (المستخدم نزل): يبقى ظاهرًا
      },
      { threshold: 0.15, rootMargin: "0px 0px -30% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}>
      {children}
    </div>
  );
}
