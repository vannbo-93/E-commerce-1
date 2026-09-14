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
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold pt-8 mb-1">Choose a payment method</h2>
      <p className="text-sm text-gray-400 mb-6">
        Select the preferred method to complete your payment
      </p>

      <div className="flex flex-col gap-3">
        {paymentOptions.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <label
              key={option.id}
              htmlFor={option.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 hover:border-gray-500"
                }`}>
              <input
                type="radio"
                name="paymentMethod"
                id={option.id}
                value={option.id}
                checked={isSelected}
                onChange={() => setSelectedMethod(option.id)}
                className="hidden"
              />

              <div
                className={`w-11 h-11 flex items-center justify-center rounded-full shrink-0
                  ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}>
                {option.icon}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-sm">{option.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {option.description}
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-500"
                  }`}>
                {isSelected && <Check size={12} className="text-white" />}
              </div>
            </label>
          );
        })}
      </div>

      <div className="flex justify-between items-center gap-3 mt-8 pt-5 border-t border-gray-700">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-bold">Amount due</span>
          <span className="text-lg font-bold">{total} MAD</span>
        </div>

        <button
          type="button"
          disabled={!selectedMethod}
          onClick={handleConfirm}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-blue-700 active:scale-95 transition-all">
          Complete purchase
        </button>
      </div>
    </div>
  );
};

export default ChoosePayMethoud;
