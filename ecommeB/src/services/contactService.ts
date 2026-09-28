/** @format */
import ContactMessage from "../models/contactMessageModel.js";
import { AppError } from "../utils/AppError.js";
import { sendMail } from "../utils/mailer.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// سطر واحد: فواصل الأسطر في عنوان البريد قد تُستغل لحقن ترويسات إضافية
const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const validate = (input: ContactInput): ContactInput => {
  const name = singleLine(input.name);
  const email = input.email.trim().toLowerCase();
  const subject = singleLine(input.subject);
  const message = input.message.trim();

  if (!name || name.length > 100) {
    throw new AppError("Please enter your name (up to 100 characters)", 400);
  }
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    throw new AppError("Please enter a valid email address", 400);
  }
  if (subject.length > 150) {
    throw new AppError("Subject is too long (up to 150 characters)", 400);
  }
  if (message.length < 10) {
    throw new AppError("Please write a message of at least 10 characters", 400);
  }
  if (message.length > 5000) {
    throw new AppError("Message is too long (up to 5000 characters)", 400);
  }

  return { name, email, subject, message };
};

// إشعار لبريد الدعم. فشله لا يُفشل الطلب: الرسالة محفوظة في قاعدة البيانات أصلًا
const notifySupport = async (msg: ContactInput) => {
  const supportEmail = process.env.SUPPORT_EMAIL;
  if (!supportEmail) {
    console.warn(
      "[contact] SUPPORT_EMAIL is not set: message saved, but no notification was sent.",
    );
    return;
  }

  const subjectLine = msg.subject || "(no subject)";

  try {
    await sendMail({
      to: supportEmail,
      replyTo: msg.email, // "رد" في برنامج بريدك يصل للعميل مباشرة
      subject: `[Support] ${subjectLine} — from ${msg.name}`,
      text: [
        `New support message from ${msg.name} <${msg.email}>`,
        `Subject: ${subjectLine}`,
        "",
        msg.message,
        "",
        "Reply to this email to answer the customer directly.",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;color:#111">
          <h2 style="margin-bottom:4px">New support message</h2>
          <p style="margin:0;color:#555">From <strong>${escapeHtml(msg.name)}</strong> &lt;${escapeHtml(msg.email)}&gt;</p>
          <p style="margin:4px 0 16px;color:#555">Subject: ${escapeHtml(subjectLine)}</p>
          <div style="white-space:pre-wrap;background:#f5f5f5;padding:16px;border-radius:8px">${escapeHtml(msg.message)}</div>
          <p style="font-size:13px;color:#666;margin-top:16px">Reply to this email to answer the customer directly.</p>
        </div>`,
    });
  } catch (err) {
    console.error("[contact] Failed to send support notification:", err);
  }
};

export const createContactMessage = async (
  input: ContactInput,
): Promise<void> => {
  const clean = validate(input);
  await ContactMessage.create(clean);
  await notifySupport(clean);
};
