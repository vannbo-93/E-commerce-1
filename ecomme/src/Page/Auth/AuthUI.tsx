/** @format */
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode} from "react";

/* الصفحة + البطاقة البيضاء المستديرة (نفس بطاقات السلة والدفع) */
export const AuthCard = ({ title, subtitle, children,}: { title: string; subtitle?: string; children: ReactNode;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  </div>
);

/* حقل الإدخال: نفس حقل "Coupon code" */
export const AuthInput = ({
  label,
  className = "",
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div>
    <label htmlFor={id} className="sr-only">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className={`w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 
        focus:outline-none focus:ring-2 focus:ring-sky-400/40 ${className}`}
    />
  </div>
);

/* الزر الأساسي: نفس زر Checkout / Complete purchase */
export const AuthButton = ({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`w-full rounded-lg bg-sky-500 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-sky-600 focus:outline-none focus:ring-2 
        focus:ring-sky-400/40 ${className}`}
  />
);

/* الزر الثانوي: للروابط المؤقتة */
export const authSecondaryLinkClass =
  "flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50";
