/** @format */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Banknote, Check } from "lucide-react";

type PaymentMethod = "visa" | "cod";

interface ChoosePayMethoudProps {
  total: number;
  onConfirm: (method: PaymentMethod) => void;
}

const paymentOptions: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "visa",
    label: "Pay by card",
    description: "Pay directly using a credit or debit card",
    icon: <CreditCard size={22} />,
  },
  {
    id: "cod",
    label: "Cash on delivery",
    description: "Pay in cash when your order arrives at your door",
    icon: <Banknote size={22} />,
  },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

const ChoosePayMethoud: React.FC<ChoosePayMethoudProps> = ({
  total,
  onConfirm,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!selectedMethod) return;
    onConfirm(selectedMethod);
    navigate("/order/success");
  };

  return (
    <div className="mx-auto max-w-xl px-4 pb-10">
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]">
        {/* حجم العنوان بـ style لأن CSS عامًا على العناوين قد يتغلب على Tailwind */}
        <h2
          className="mb-1 font-bold text-gray-900"
          style={{ fontSize: "1.5rem" }}>
          Choose a payment method
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          Select the preferred method to complete your payment
        </p>

        <fieldset>
          <legend className="sr-only">Payment method</legend>
          <div className="flex flex-col gap-3">
            {paymentOptions.map((option) => {
              const isSelected = selectedMethod === option.id;
              return (
                <label
                  key={option.id}
                  htmlFor={option.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors has-[:focus-visible]:ring-2 
                    has-[:focus-visible]:ring-sky-300 ${
                      isSelected
                        ? "border-sky-500 bg-sky-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                  {/* sr-only بدل hidden ليبقى الاختيار ممكنًا بلوحة المفاتيح */}
                  <input
                    type="radio"
                    name="paymentMethod"
                    id={option.id}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => setSelectedMethod(option.id)}
                    className="sr-only"
                  />

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isSelected
                        ? "bg-sky-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                    {option.icon}
                  </div>

                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {option.label}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {option.description}
                    </div>
                  </div>

                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      isSelected
                        ? "border-sky-500 bg-sky-500"
                        : "border-gray-300"
                    }`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500">
              Amount due
            </span>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(total)}
            </span>
          </div>

          <button
            type="button"
            disabled={!selectedMethod || total <= 0}
            onClick={handleConfirm}
            className="rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-sky-600 active:scale-95 
            disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500 disabled:active:scale-100">
            Complete purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePayMethoud;
