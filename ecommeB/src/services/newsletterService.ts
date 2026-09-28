/** @format */
import crypto from "crypto";
import mongoose from "mongoose";
import NewsletterSubscriber from "../models/newsletterModel.js";
import { AppError } from "../utils/AppError.js";
import { sendMail } from "../utils/mailer.js";

// فحص شكلي معقول؛ التحقق الحقيقي من ملكية البريد هو رابط التأكيد نفسه
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONFIRM_TTL_MS = 48 * 60 * 60 * 1000; // صلاحية رابط التأكيد: 48 ساعة
const RESEND_COOLDOWN_MS = 10 * 60 * 1000; // رسالة تأكيد واحدة كل 10 دقائق كحد أقصى

// رابط الباك إند العام: تُبنى منه روابط التأكيد وإلغاء الاشتراك في الرسائل
const apiBaseUrl = () =>
  (process.env.API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

const newsletterSecret = (): string => {
  const secret = process.env.NEWSLETTER_SECRET;
  if (!secret) {
    throw new Error("NEWSLETTER_SECRET is missing in .env");
  }
  return secret;
};

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

// رمز إلغاء الاشتراك موقَّع ومشتق من معرّف المشترك: لا يُخزَّن، ولا يمكن تخمينه
export const createUnsubscribeToken = (subscriberId: string) =>
  crypto
    .createHmac("sha256", newsletterSecret())
    .update(`unsubscribe:${subscriberId}`)
    .digest("hex");

export const buildUnsubscribeUrl = (subscriberId: string) =>
  `${apiBaseUrl()}/newsletter/unsubscribe?id=${subscriberId}&token=${createUnsubscribeToken(subscriberId)}`;

const isDuplicateKeyError = (err: unknown) =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  (err as { code: unknown }).code === 11000;

const sendConfirmationEmail = async (email: string, token: string) => {
  const link = `${apiBaseUrl()}/newsletter/confirm?token=${token}`;
  await sendMail({
    to: email,
    subject: "Confirm your subscription",
    text: [
      "Thanks for subscribing to our newsletter!",
      "",
      "Please confirm your email address by opening this link:",
      link,
      "",
      "The link expires in 48 hours.",
      "If you didn't request this, you can ignore this email and you won't be subscribed.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#111">
        <h2 style="margin-bottom:8px">Confirm your subscription</h2>
        <p>Thanks for subscribing to our newsletter! Please confirm your email address.</p>
        <p style="margin:24px 0">
          <a href="${link}" style="background:#0ea5e9;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;
          font-weight:600">
            Confirm subscription
          </a>
        </p>
        <p style="font-size:13px;color:#666">The link expires in 48 hours.</p>
        <p style="font-size:13px;color:#666">If you didn't request this, you can ignore this email and you won't be subscribed.</p>
      </div>`,
  });
};

// الرد واحد دائمًا في الكنترولر، مهما كانت حالة البريد:
// لا يكشف إن كان البريد مشتركًا أو معلّقًا أو ألغى اشتراكه
export const subscribe = async (rawEmail: string): Promise<void> => {
  const email = rawEmail.trim().toLowerCase();

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    throw new AppError("Please enter a valid email address", 400);
  }

  const existing = await NewsletterSubscriber.findOne({ email });

  // مشترك مؤكد: لا شيء يُفعل
  if (existing?.status === "active") return;

  // رسالة تأكيد أُرسلت قبل قليل: لا نرسل غيرها (حماية من الإغراق)
  if (
    existing?.status === "pending" &&
    existing.confirmSentAt &&
    Date.now() - existing.confirmSentAt.getTime() < RESEND_COOLDOWN_MS
  ) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");

  try {
    await NewsletterSubscriber.updateOne(
      { email },
      {
        $set: {
          status: "pending",
          confirmTokenHash: hashToken(token),
          confirmTokenExpires: new Date(Date.now() + CONFIRM_TTL_MS),
        },
        $setOnInsert: { email },
      },
      { upsert: true },
    );
  } catch (err) {
    // طلبان متزامنان لنفس البريد: الثاني يصطدم بالفهرس الفريد، والأول تكفّل بكل شيء
    if (isDuplicateKeyError(err)) return;
    throw err;
  }

  try {
    await sendConfirmationEmail(email, token);
  } catch (err) {
    console.error("[newsletter] Failed to send confirmation email:", err);
    throw new AppError(
      "We couldn't send the confirmation email. Please try again later.",
      502,
    );
  }

  // يُسجَّل وقت الإرسال بعد نجاحه فقط، فالفشل يسمح بإعادة المحاولة فورًا
  await NewsletterSubscriber.updateOne(
    { email },
    { $set: { confirmSentAt: new Date() } },
  );
};

// يعيد true إن تم التأكيد، false إن كان الرابط غير صالح أو منتهيًا
export const confirmSubscription = async (token: string): Promise<boolean> => {
  if (!/^[a-f0-9]{64}$/.test(token)) return false;

  const result = await NewsletterSubscriber.updateOne(
    {
      confirmTokenHash: hashToken(token),
      confirmTokenExpires: { $gt: new Date() },
      status: "pending",
    },
    {
      $set: { status: "active", confirmedAt: new Date() },
      $unset: { confirmTokenHash: 1, confirmTokenExpires: 1 },
    },
  );
  return result.modifiedCount === 1;
};

// يعيد true إن كان الرابط صحيحًا (حتى لو كان الاشتراك ملغى مسبقًا)
export const unsubscribe = async (
  subscriberId: string,
  token: string,
): Promise<boolean> => {
  if (!mongoose.isValidObjectId(subscriberId)) return false;
  if (!/^[a-f0-9]{64}$/.test(token)) return false;

  const expected = Buffer.from(createUnsubscribeToken(subscriberId), "hex");
  const received = Buffer.from(token, "hex");
  // مقارنة ثابتة الزمن: لا تسرّب عبر التوقيت كم حرفًا من الرمز صحيح
  if (!crypto.timingSafeEqual(expected, received)) return false;

  const subscriber = await NewsletterSubscriber.findById(subscriberId);
  if (!subscriber) return false;

  if (subscriber.status !== "unsubscribed") {
    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
    subscriber.confirmTokenHash = undefined;
    subscriber.confirmTokenExpires = undefined;
    await subscriber.save();
  }
  return true;
};
