/** @format */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import api from "../../Api/baseURL";
import { optimizeImage } from "@/utils/cloudinary";

const PRODUCTS_PATH = "/products";
const MIN_CHARS = 2;
const DEBOUNCE_MS = 250;
const MAX_SUGGESTIONS = 5;

interface Suggestion {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface SearchBoxProps {
  className?: string;
  // بعد أي انتقال (لإغلاق قائمة الموبايل مثلًا)
  onNavigate?: () => void;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

const SearchBox = ({ className = "", onNavigate }: SearchBoxProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  // رقم كل طلب: الرد الذي يصل بعد طلب أحدث يُتجاهل
  const requestIdRef = useRef(0);

  // يبدأ بنص البحث الحالي إن فُتحت الصفحة على /products?search=...
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // -1 = لا عنصر محدد. العنصر الأخير (index = results.length) هو "See all results"
  const [active, setActive] = useState(-1);

  const trimmed = query.trim();
  const canSuggest = trimmed.length >= MIN_CHARS;

  // جلب الاقتراحات بعد توقف الكتابة
  useEffect(() => {
    if (!canSuggest) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- مسح الاقتراحات حين يقصر النص
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const requestId = ++requestIdRef.current;
    const timer = window.setTimeout(() => {
      const q = new URLSearchParams({
        search: trimmed,
        limit: String(MAX_SUGGESTIONS),
      });
      api
        .get(`/product?${q.toString()}`)
        .then((res) => {
          if (requestId === requestIdRef.current) {
            setResults(res.data.products ?? []);
            setActive(-1);
          }
        })
        .catch(() => {
          if (requestId === requestIdRef.current) setResults([]);
        })
        .finally(() => {
          if (requestId === requestIdRef.current) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [trimmed, canSuggest]);

  // إغلاق عند الضغط خارج المكوّن
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const goTo = (path: string) => {
    setOpen(false);
    setActive(-1);
    navigate(path);
    onNavigate?.();
  };

  const goToAllResults = () => {
    if (!trimmed) return;
    goTo(`${PRODUCTS_PATH}?search=${encodeURIComponent(trimmed)}`);
  };

  const goToProduct = (id: string) => goTo(`${PRODUCTS_PATH}/${id}`);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (active >= 0 && active < results.length) {
      goToProduct(results[active]!._id);
    } else {
      goToAllResults();
    }
  };

  // عدد العناصر القابلة للتحديد: المنتجات + "See all results"
  const itemCount = results.length + (canSuggest ? 1 : 0);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (!open || itemCount === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % itemCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? itemCount - 1 : i - 1));
    }
  };

  const showDropdown = open && canSuggest;
  const optionId = (i: number) => `${listId}-option-${i}`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products"
          aria-label="Search products"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listId}
          aria-autocomplete="list"
          {...(active >= 0
            ? { "aria-activedescendant": optionId(active) }
            : {})}
          autoComplete="off"
          className="w-full rounded-lg border border-gray-200 bg-gray-100 py-2 pl-9 pr-8 text-sm text-gray-900 outline-none 
          transition-colors placeholder:text-gray-400 focus:border-sky-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setActive(-1);
            }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full 
            text-gray-400 hover:bg-gray-200 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </form>

      {showDropdown && (
        <div
          id={listId}
          role="listbox"
          // مثبتة على اليمين: خانة البحث قرب حافة الشاشة اليمنى، فلا تخرج القائمة منها
          className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border 
          border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          {loading && results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">Searching...</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">
              No products match "{trimmed}"
            </p>
          ) : (
            <ul className={loading ? "opacity-60" : ""}>
              {results.map((p, i) => (
                <li
                  key={p._id}
                  id={optionId(i)}
                  role="option"
                  aria-selected={active === i}
                  // mousedown لا click: يسبق فقدان التركيز من الخانة
                  onMouseDown={(e) => {
                    e.preventDefault();
                    goToProduct(p._id);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${
                    active === i ? "bg-sky-50" : ""
                  }`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    {p.images[0] && (
                      <img
                        src={optimizeImage(p.images[0], 160)}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    )}
                  </div>
                  <span className="min-w-0 flex-1 truncate text-sm text-gray-900">
                    {p.name}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-gray-900">
                    {formatPrice(p.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* كل النتائج في صفحة المتجر */}
          <div
            id={optionId(results.length)}
            role="option"
            aria-selected={active === results.length}
            onMouseDown={(e) => {
              e.preventDefault();
              goToAllResults();
            }}
            onMouseEnter={() => setActive(results.length)}
            className={`cursor-pointer border-t border-gray-100 px-4 py-2.5 text-sm font-medium text-sky-600 ${
              active === results.length ? "bg-sky-50" : ""
            }`}>
            See all results for "{trimmed}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
