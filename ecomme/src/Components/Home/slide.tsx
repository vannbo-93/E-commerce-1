/** @format */
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const defaultSlides = [
  { id: 1, image: "src/images/slide/slide-1-audio-mobile.webp", alt: "show 1" },
  { id: 2, image: "src/images/slide/slide-2-smart-home.webp", alt: "show 2" },
  { id: 3, image: "src/images/slide/slide-3-creator-gear.webp", alt: "show 3" },
  { id: 4, image: "src/images/slide/slide-4-gaming.webp", alt: "show 4" },
  { id: 5, image: "src/images/slide/slide-5-wearables.webp", alt: "show 5" },
];

function Slide({ slides = defaultSlides }) {
  const extendedSlides = [...slides, { ...slides[0], id: "clone-first" }];

  const [current, setCurrent] = useState(0);
  const [withTransition, setWithTransition] = useState(true);

  const goTo = (index: number) => {
    setWithTransition(true);
    setCurrent(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setWithTransition(true);
      setCurrent((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // عند الوصول للشريحة المستنسخة (الأخيرة)، اقفز فورًا بدون انتقال للشريحة الأولى الحقيقية
  useEffect(() => {
    if (current === extendedSlides.length - 1) {
      const timeout = setTimeout(() => {
        setWithTransition(false);
        setCurrent(0);
      }, 300); // نفس مدة duration-300 الحالية
      return () => clearTimeout(timeout);
    }
  }, [current, extendedSlides.length]);

  return (
    <div className="relative w-full max-w-7xl mx-auto select-none">
      <div className="overflow-hidden ">
        {/*start text*/}
        <div className="absolute inset-0 bg-black/800" />
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center gap-2 sm:px-8 max-w-md z-10">
          <span className="text-sky-400 font-semibold text-sm tracking-wide translate-y-2">
            NEW COLLECTION 2026
          </span>
          <h1 className="text-5xl sm:text-9xl">DISCOVER PRODUCTS</h1>
          <p className="text-gray-800  font-bold">
            Explore our latest collection of premium products carefully selected
            for quality.
          </p>
          <div className="flex gap-3 mt-2">
            <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium px-5 py-3 rounded-lg transition-colors">
              Shop Now <ChevronRight size={16} />
            </button>
            <button className="border border-black/30 hover:border-sky-400 hover:text-sky-400 text-black font-medium px-5 py-1 rounded-lg transition-colors">
              Explore Deals
            </button>
          </div>
        </div>
        {/*the end*/}
        <div
          className={`flex ${withTransition ? "transition-transform duration-300 ease-out" : ""}`}
          style={{ transform: `translateX(-${current * 100}%)` }}>
          {extendedSlides.map((slide, i) => (
            <div
              key={`${slide.id}-${i}`}
              className="min-w-full aspect-[1920/815]">
              <img
                src={slide.image}
                alt={slide.alt}
                loading={i === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-3">
        <button
          onClick={() => goTo((current - 1 + slides.length) % slides.length)}
          aria-label="Previous"
          className="bg-black/40 hover:bg-black/60 text-white hover:text-sky-400 rounded-full p-2 transition-colors cursor-pointer">
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                current % slides.length === i ? "bg-blue-300" : "bg-black/20"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo((current + 1) % slides.length)}
          aria-label="Next"
          className="bg-black/40 hover:bg-black/60 text-white hover:text-sky-400 rounded-full p-2 transition-colors cursor-pointer">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default Slide;
