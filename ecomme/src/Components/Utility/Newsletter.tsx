/** @format */
import { useRef, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import api from "../../Api/baseURL";

type Status = "idle" | "submitting" | "success" | "error";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  // حماية متزامنة من الضغط المزدوج قبل أن يتحدّث الـ state
  const submittingRef = useRef(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || submittingRef.current) return;

    submittingRef.current = true;
    setStatus("submitting");
    setMessage("");

    try {
      const res = await api.post("/newsletter", { email: value });
      setStatus("success");
      setMessage(res.data?.message ?? "You're subscribed!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(
        isAxiosError(err)
          ? (err.response?.data?.message ?? "Something went wrong")
          : "Something went wrong",
      );
    } finally {
      submittingRef.current = false;
    }
  };

  const submitting = status === "submitting";

  return (
    <section className="mx-auto my-12 w-full max-w-7xl px-3">
      <div className="relative flex min-h-[220px] items-center overflow-hidden rounded-xl bg-[#f5f5f5] px-8 py-8 md:px-12">
        {/* Content */}
        <div className="relative z-10 w-full max-w-[500px]">
          <h2 className="text-2xl font-bold text-[#08060d] md:text-3xl">
            Get the Latest Tech & Deals
          </h2>

          <p className="mt-2 text-sm leading-7 text-[#6b6375]">
            Join us and never miss out on new products and exclusive offers.
          </p>

          {/* Email Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 flex w-full max-w-[400px] overflow-hidden rounded-lg bg-white shadow-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // إخفاء رسالة سابقة عند بدء كتابة بريد جديد
                if (status !== "idle" && status !== "submitting") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              placeholder="Enter your email"
              aria-label="Email address"
              autoComplete="email"
              disabled={submitting}
              className="min-w-0 flex-1 px-4 py-3 text-sm text-[#08060d] outline-none placeholder:text-[#999] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={submitting || email.trim() === ""}
              className="bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 
              disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-sky-500">
              {submitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {message ? (
            <p
              role={status === "error" ? "alert" : "status"}
              className={`mt-2 text-sm ${
                status === "error" ? "text-red-600" : "text-green-600"
              }`}>
              {message}
            </p>
          ) : (
            <p className="mt-2 text-xs text-[#6b6375]">
              We'll only use your email to send store news. You can unsubscribe
              anytime.
            </p>
          )}
        </div>
        {/* Decorative Envelope */}
        <div
          className="absolute bottom-[100px] right-8 hidden text-[150px] opacity-8 md:block"
          aria-hidden="true">
          ✉
        </div>
        {/* Decorative Circles */}
        <div className="absolute right-[-60px] top-[-60px] h-48 w-48 rounded-full bg-sky-500 opacity-10" />
        <div className="absolute bottom-[-80px] right-[100px] h-40 w-40 rounded-full bg-sky-500 opacity-10" />
      </div>
    </section>
  );
};

export default Newsletter;
