/** @format */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const defaultSlides = [
  { id: 1, content: "slide 1" },
  { id: 2, content: "slide 2" },
  { id: 3, content: "slide 3" },
  { id: 4, content: "slide 4" },
];

function Slide({ slides = defaultSlides }) {
  const [current, setCurrent] = useState(0);

  const goTo = (index: number) => {
    const next = (index + slides.length) % slides.length;
    setCurrent(next);
  };
  return (
    <div className="relative w-full max-w mx-auto select-none">
      {/* Track */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}>
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="min-w-full flex items-center justify-center h-64 bg-indigo-900/10 border-indigo-900/20 text-white text-lg">
              {slide.content}
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={() => goTo(current - 1)}
        aria-label="السابق"
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors cursor-pointer">
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => goTo(current + 1)}
        aria-label="التالي"
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors cursor-pointer">
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`الانتقال إلى الشريحة ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-indigo-500" : "bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Slide;
