/** @format */
import nodemailer, { type Transporter } from "nodemailer";

// الإرسال عبر SMTP القياسي: يعمل مع أي خدمة (Brevo, Resend, Mailgun, SES...)
// بتغيير متغيرات .env فقط. بدون SMTP_HOST يُستخدم Ethereal: صندوق وهمي للتطوير.

let transporterPromise: Promise<Transporter> | null = null;

const createTransporter = async (): Promise<Transporter> => {
  const host = process.env.SMTP_HOST;

  if (host) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = TLS مباشر، 587 = STARTTLS
      auth: {
        user: process.env.SMTP_USER ?? "",
        pass: process.env.SMTP_PASS ?? "",
      },
    });
  }

  // لا يوجد SMTP_HOST. في الإنتاج لا نرسل إلى صندوق وهمي أبدًا:
  // الأفضل أن يفشل الطلب بوضوح من أن يرى الزائر "تحقق من بريدك" وبريد لن يصل
  if (process.env.NODE_ENV === "production") {
    throw new Error("[mailer] SMTP_HOST is not set in production");
  }

  const testAccount = await nodemailer.createTestAccount();
  console.log(
    "[mailer] SMTP_HOST not set: using Ethereal test inbox. Emails will NOT reach real people.",
  );
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
};

const getTransporter = (): Promise<Transporter> => {
  if (!transporterPromise) {
    transporterPromise = createTransporter().catch((err) => {
      // لا نحتفظ بفشل دائم: المحاولة التالية تعيد إنشاء الاتصال
      transporterPromise = null;
      throw err;
    });
  }
  return transporterPromise;
};

export interface MailInput {
  to: string;
  subject: string;
  html: string;
  text: string; // نسخة نصية: بعض برامج البريد لا تعرض HTML، وغيابها يرفع احتمال السبام
  replyTo?: string; // "رد" في برنامج البريد يذهب لهذا العنوان بدل المرسل
  headers?: Record<string, string>;
}

export const sendMail = async (input: MailInput): Promise<void> => {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "Shop <no-reply@shop.local>",
    ...input,
  });

  // مع Ethereal فقط: رابط لمعاينة الرسالة كما ستظهر
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) console.log(`[mailer] Preview: ${previewUrl}`);
};
