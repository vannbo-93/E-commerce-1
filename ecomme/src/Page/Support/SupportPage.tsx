/** @format */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { isAxiosError } from "axios";
import { IconChevronDown, IconMail, IconPhone } from "@tabler/icons-react";
import api from "../../Api/baseURL";
import { useAuth } from "../../context/AuthContext";

const PHONE = "+212667500649";
const PHONE_WA = "212667500649";

// أسئلة عن ميزات موجودة فعلًا فقط.
// أضف أسئلة الشحن والإرجاع والدفع حين تُتخذ قراراتها ويُبنى نظام الطلبات.
const FAQ: { q: string; a: string }[] = [
  {
    q: "Do I need an account to shop?",
    a: "You can browse all products without an account. To add items to your cart, save favorites, or write reviews, you'll need to sign in.",
  },
  {
    q: "Is my cart saved if I close the browser?",
    a: "Yes. Your cart is saved to your account, so it's there when you come back, on any device you sign in from.",
  },
  {
    q: "How do favorites work?",
    a: "Tap the heart on any product to save it. You'll find all your saved products under Wishlist in your account menu.",
  },
  {
    q: "Why do some products say “Choose options”?",
    a: "Those products come in several colors. Open the product page, pick a color, then add it to your cart.",
  },
  {
    q: "How do I leave a review?",
    a: "Sign in, open the product page, and use the review section at the bottom. You can leave one review per product.",
  },
  {
    q: "How do I unsubscribe from the newsletter?",
    a: "Every newsletter email has an unsubscribe link at the bottom. One click and a confirmation, and you're off the list.",
  },
];

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 disabled:opacity-60";

type Status = "idle" | "submitting" | "success" | "error";

const ContactForm = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // مصيدة للبرامج الآلية
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const submittingRef = useRef(false);

  const submitting = status === "submitting";
  const canSubmit =
    name.trim() !== "" &&
    email.trim() !== "" &&
    message.trim().length >= 10 &&
    !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submittingRef.current) return;

    submittingRef.current = true;
    setStatus("submitting");
    setFeedback("");

    try {
      const res = await api.post("/contact", {
        name,
        email,
        subject,
        message,
        website,
      });
      setStatus("success");
      setFeedback(res.data?.message ?? "Thanks! We'll get back to you soon.");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setFeedback(
        isAxiosError(err)
          ? (err.response?.data?.message ?? "Something went wrong")
          : "Something went wrong",
      );
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="contact-name"
            className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            autoComplete="name"
            disabled={submitting}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="contact-email"
            className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            autoComplete="email"
            disabled={submitting}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="contact-subject"
          className="text-sm font-medium text-gray-700">
          Subject <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={150}
          disabled={submitting}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="contact-message"
          className="text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          maxLength={5000}
          placeholder="How can we help?"
          disabled={submitting}
          className={`${inputClass} resize-y`}
        />
        <span className="text-right text-xs text-gray-400">
          {message.length}/5000
        </span>
      </div>

      {/* مصيدة: مخفية عن البشر وقارئات الشاشة، والبرامج الآلية تملؤها */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600 
          disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500">
          {submitting ? "Sending..." : "Send message"}
        </button>
        {feedback && (
          <p
            role={status === "error" ? "alert" : "status"}
            className={`text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`}>
            {feedback}
          </p>
        )}
      </div>
    </form>
  );
};

const SupportPage = () => {
  const { hash } = useLocation();

  // React Router لا ينتقل إلى #faq أو #contact تلقائيًا: ننتقل يدويًا
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
      <p className="mt-2 text-gray-600">
        Find quick answers below, or send us a message and we'll get back to
        you.
      </p>

      {/* طرق التواصل السريعة */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a
          href={`https://wa.me/${PHONE_WA}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl bg-white p-4 text-gray-900 no-underline shadow-[0_2px_16px_rgba(0,0,0,0.08)] 
          transition-shadow hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-500">
            <IconPhone size={20} />
          </span>
          <span>
            <span className="block text-sm font-semibold">
              Call or WhatsApp
            </span>
            <span className="block text-sm text-gray-500">{PHONE}</span>
          </span>
        </a>
        <a
          href="#contact"
          className="flex items-center gap-3 rounded-2xl bg-white p-4 text-gray-900 no-underline shadow-[0_2px_16px_rgba(0,0,0,0.08)] 
          transition-shadow hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-500">
            <IconMail size={20} />
          </span>
          <span>
            <span className="block text-sm font-semibold">Send a message</span>
            <span className="block text-sm text-gray-500">
              Use the form below
            </span>
          </span>
        </a>
      </div>

      {/* الأسئلة الشائعة: details/summary عنصر أصلي، يعمل بلوحة المفاتيح دون state */}
      <section id="faq" className="mt-12 scroll-mt-24">
        <h2 className="text-xl font-bold text-gray-900">
          Frequently asked questions
        </h2>
        <div className="mt-4 divide-y divide-gray-100 rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          {FAQ.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-gray-900 
              [&::-webkit-details-marker]:hidden">
                {item.q}
                <IconChevronDown
                  size={18}
                  className="shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* نموذج التواصل */}
      <section id="contact" className="mt-12 scroll-mt-24">
        <h2 className="text-xl font-bold text-gray-900">Contact us</h2>
        <p className="mt-1 text-sm text-gray-600">
          Didn't find your answer? Send us a message.
        </p>
        <div className="relative mt-4 rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.08)] md:p-6">
          <ContactForm />
        </div>
        <p className="mt-3 text-xs text-gray-500">
          We use your name and email only to reply to you. See our{" "}
          <Link to="/privacy" className="text-sky-600">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </div>
  );
};

export default SupportPage;
