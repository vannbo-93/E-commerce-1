/** @format */
import { useEffect, useRef } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SubTitle from "../../Components/Utility/SubTitle";

import voltex from "../../images/brands/01-voltex.png";
import nuvorax from "../../images/brands/02-nuvora.png";
import kiro from "../../images/brands/03-kiro.png";
import aerolux from "../../images/brands/04-aerolux.png";
import zentro from "../../images/brands/05-zentro.png";
import lumiq from "../../images/brands/06-lumiq.png";
import orbyt from "../../images/brands/07-orbyt.png";
import vantra from "../../images/brands/08-vantra.png";
import novexa from "../../images/brands/09-novexa.png";
import ekko from "../../images/brands/10-ekko.png";

interface Brand {
  id: string;
  name: string;
  logo?: string;
}

const brands: Brand[] = [
  { id: "1", name: "voltex", logo: voltex },
  { id: "2", name: "nuvorax", logo: nuvorax },
  { id: "3", name: "kiro", logo: kiro },
  { id: "4", name: "aerolux", logo: aerolux },
  { id: "5", name: "zentro", logo: zentro },
  { id: "6", name: "lumiq", logo: lumiq },
  { id: "7", name: "orbyt", logo: orbyt },
  { id: "8", name: "vantra", logo: vantra },
  { id: "9", name: "novexa", logo: novexa },
  { id: "10", name: "ekko", logo: ekko },
];

interface BrandFeaturedProps { title?: string; btntitle?: string; pathText?: string;}

const BrandFeatured = ({ title, btntitle, pathText }: BrandFeaturedProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const SPEED = 400; // بكسل في الثانية، زده لتسريع المرور

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const animateTo = (target: number) => {
    const el = scrollRef.current;
    if (!el) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const start = el.scrollLeft;
    const distance = target - start;
    if (Math.abs(distance) < 1) return;

    const duration = (Math.abs(distance) / SPEED) * 1000;
    const t0 = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1);
      el.scrollLeft = start + distance * progress;
      animRef.current = progress < 1 ? requestAnimationFrame(step) : null;
    };
    animRef.current = requestAnimationFrame(step);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const atStart = el.scrollLeft <= 1;
    const atEnd = el.scrollLeft >= max - 1;

    if (direction === "right") animateTo(atEnd ? 0 : max);
    else animateTo(atStart ? max : 0);
  };

  return (
    <div className="my-4 w-full">
      {title ? (
        <SubTitle title={title} btnTitle={btntitle} pathText={pathText} />
      ) : null}

      <div className="flex items-center gap-4">
        <button type="button" aria-label="Scroll left" onClick={() => scroll("left")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-md hover:bg-gray-50">
          <ChevronLeftIcon className="!h-5 !w-5" />
        </button>

        <div ref={scrollRef}
          className="flex flex-1 items-center gap-6 overflow-x-auto scroll-smooth px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden 
          [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]">
          {brands.map((brand) => (
            <div key={brand.id} className="flex h-14 w-32 shrink-0 items-center justify-center">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain"/>
              ) : null}
            </div>
          ))}
        </div>

        <button type="button" aria-label="Scroll right" onClick={() => scroll("right")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-md hover:bg-gray-50">
          <ChevronRightIcon className="!h-5 !w-5" />
        </button>
      </div>
    </div>
  );
};

export default BrandFeatured;
