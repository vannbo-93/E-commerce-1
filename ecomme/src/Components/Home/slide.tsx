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

  // النص كله بوحدة em، فيتناسب مع حجم الخط الأساسي للحاوية التي تضعه
  const renderText = (headingSize: string) => (
    <>
      <span
        className="font-semibold tracking-wide text-sky-400"
        style={{ fontSize: "0.9em" }}>
        NEW COLLECTION 2026
      </span>
      <h1
        className="font-bold leading-none"
        style={{ fontSize: headingSize, margin: "0.15em 0" }}>
        DISCOVER PRODUCTS
      </h1>
      <p className="text-gray-800" style={{ maxWidth: "28em" }}>
        Explore our latest collection of premium products carefully selected for
        quality.
      </p>
      <div
        className="flex flex-wrap"
        style={{ gap: "0.8em", marginTop: "0.8em" }}>
        <button
          className="flex items-center gap-2 rounded-lg bg-sky-500 font-medium text-white transition-colors hover:bg-sky-600"
          style={{ padding: "0.7em 1.3em" }}>
          Shop Now <ChevronRight size="1.2em" />
        </button>
        <button
          className="rounded-lg border border-black/30 font-medium text-black transition-colors hover:border-sky-400 hover:text-sky-400"
          style={{ padding: "0.7em 1.3em" }}>
          Explore Deals
        </button>
      </div>
    </>
  );

  return (
    <div className="mx-auto w-full max-w-7xl select-none">
      {/* منطقة الصور: تقيس النص حسب عرضها هي وليس عرض الشاشة */}
      <div className="relative" style={{ containerType: "inline-size" }}>
        <div className="overflow-hidden">
          <div
            className={`flex ${withTransition ? "transition-transform duration-300 ease-out" : ""}`}
            style={{ transform: `translateX(-${current * 100}%)` }}>
            {extendedSlides.map((slide, i) => (
              <div
                key={`${slide.id}-${i}`}
                className="aspect-[16/10] min-w-full md:aspect-[1920/815]">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover object-right md:object-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* النص فوق الصورة: من md فما فوق */}
        <div
          className="absolute inset-y-0 left-0 z-10 hidden w-[52%] flex-col justify-center pl-[4%] md:flex"
          style={{ fontSize: "clamp(9px, 1.55cqw, 18px)" }}>
          {renderText("3.2em")}
        </div>

        {/* الأزرار والنقاط */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-3">
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            aria-label="Previous"
            className="cursor-pointer rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60 hover:text-sky-400">
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${
                  current % slides.length === i ? "bg-blue-300" : "bg-black/20"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo((current + 1) % slides.length)}
            aria-label="Next"
            className="cursor-pointer rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60 hover:text-sky-400">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* النص تحت الصورة: على الشاشات الصغيرة فقط */}
      <div
        className="px-4 py-5 md:hidden"
        style={{ fontSize: "clamp(13px, 3.6vw, 16px)" }}>
        {renderText("2.1em")}
      </div>
    </div>
  );
}

export default Slide;
