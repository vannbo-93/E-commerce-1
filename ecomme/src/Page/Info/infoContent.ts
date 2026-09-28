/** @format */

// محتوى صفحات المعلومات. عدّل النصوص هنا دون لمس تصميم الصفحة.

export interface InfoSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface InfoContent {
  title: string;
  lastUpdated?: string;
  intro: string;
  sections: InfoSection[];
}

// نص عام: اكتب قصة متجرك الحقيقية مكانه
export const aboutContent: InfoContent = {
  title: "About Us",
  intro:
    "Shop is an online store for electronics and everyday tech: phones, audio, wearables, and accessories.",
  sections: [
    {
      heading: "What we do",
      paragraphs: [
        "We pick products we'd use ourselves, list them with clear prices and real customer reviews, and keep shopping simple.",
      ],
    },
    {
      heading: "Get in touch",
      paragraphs: [
        "Questions, feedback, or problems with a product? Visit our Support Center or reach us on WhatsApp. We read every message.",
      ],
    },
  ],
};

// مكتوبة بحسب ما يجمعه النظام فعليًا. إن أضفت أدوات تتبع أو تحليلات
// (Google Analytics وغيرها) أو بوابة دفع، فيجب تحديث هذه الصفحة.
export const privacyContent: InfoContent = {
  title: "Privacy Policy",
  lastUpdated: "2026-09-28",
  intro:
    "This page explains what information we collect when you use our store, why we collect it, and what you can do about it.",
  sections: [
    {
      heading: "Information we collect",
      list: [
        "Account details: your username, email address, and password. Passwords are stored in a hashed form that we cannot read.",
        "Your cart and favorites: the products you add, saved to your account so they're available when you sign in.",
        "Reviews: the rating and comment you write. Reviews are public and shown with your username.",
        "Newsletter: your email address, only after you confirm your subscription through the link we send you.",
        "Support messages: the name, email address, and message you send us through the contact form.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "We use a single cookie to keep you signed in. It can't be read by scripts on the page and is not used for advertising or tracking.",
      ],
    },
    {
      heading: "How we use your information",
      list: [
        "To run your account, cart, and favorites.",
        "To show your reviews to other shoppers.",
        "To send the newsletter, only if you subscribed and confirmed.",
        "To reply to your support messages.",
      ],
      paragraphs: ["We do not sell your personal information to anyone."],
    },
    {
      heading: "Who else handles your data",
      paragraphs: [
        "Our store runs on third-party hosting and database services, and we use an email delivery service to send emails. They process data only to provide those services to us.",
      ],
    },
    {
      heading: "Your choices",
      list: [
        "Unsubscribe from the newsletter at any time using the link in any newsletter email.",
        "Remove items from your cart or favorites whenever you like.",
        "Ask us to access, correct, or delete your personal information by contacting us through the Support Center.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "If we change how we handle your information, we'll update this page and the date at the top.",
      ],
    },
  ],
};
