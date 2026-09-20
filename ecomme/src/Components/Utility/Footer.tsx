/** @format */
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import shop from "../../images/Logo/shop.png";

// عدّل المسارات لتطابق صفحاتك
const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", path: "/shop" },
      { label: "Brands", path: "/brands" },
      { label: "New Arrivals", path: "/products" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Track Your Order", path: "/track-order" },
      { label: "Shipping Policy", path: "/shipping" },
      { label: "Returns & Exchanges", path: "/returns" },
      { label: "FAQ", path: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", path: "/about" },
      { label: "Contact Us", path: "/contact" },
      { label: "Terms and Conditions", path: "/terms" },
      { label: "Privacy Policy", path: "/privacy" },
    ],
  },
];

// اكتب وسائل الدفع المتاحة عندك فعلًا
const paymentMethods = ["Visa", "Mastercard", "Cash on Delivery"];

const PHONE = "+212938573498";
const PHONE_WA = "212938573498"; // بدون + أو مسافات

const linkClass =
  "text-sm text-gray-700 transition-colors duration-200 hover:text-sky-500";

const socialClass =
  "flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:text-sky-500";

const Footer = () => {
  return (
    <footer className="footer-background mt-3">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {/* العلامة والتواصل */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="-mt-5 flex justify-center md:-mt-6">
              <img src={shop} alt="Shop logo" className="h-20 w-auto md:h-24" />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-gray-600">
              Quality products, fast delivery, and support you can count on.
            </p>
            <a
              href={`tel:${PHONE}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-sky-500">
              <Phone size={18} /> {PHONE}
            </a>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={socialClass}>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={socialClass}>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className={socialClass}>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 
                  6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://wa.me/${PHONE_WA}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className={socialClass}>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true">
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.84 11.84 0 0 0 5.64 
                  1.44h.01c6.53 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44zM12.05 21.75h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.8 1 1.01-3.7-.24-.38a9.88 
                  9.88 0 0 1-1.51-5.24c0-5.46 4.44-9.9 9.91-9.9 2.64 0 5.12 1.03 6.98 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.45 9.91-9.84 
                  9.91zm5.43-7.41c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1
                  .26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-
                  .52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.
                  1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
                </svg>
              </a>
            </div>
          </div>

          {/* أعمدة الروابط */}
          {columns.map((col, i) => (
            <div
              key={col.title}
              className={
                i === columns.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* الدفع وحقوق النشر */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-300/60 pt-6 sm:flex-row">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} <span className="font-bold">Shop</span>
            . All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-600">We accept:</span>
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
