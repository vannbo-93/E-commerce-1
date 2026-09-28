/** @format */
import type { Request, Response } from "express";
import {
  subscribe,
  confirmSubscription,
  unsubscribe,
} from "../services/newsletterService.js";
import { handleError } from "../utils/handleError.js";

// رابط الفرونت إند: زر "العودة للمتجر" في صفحات التأكيد والإلغاء
const frontendUrl = () =>
  (process.env.FRONTEND_URL ?? "http://localhost:5173").replace(/\/$/, "");

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// صفحة HTML بسيطة يعرضها الباك إند مباشرة: لا تحتاج صفحة React لكل حالة
const renderPage = (
  res: Response,
  status: number,
  title: string,
  body: string,
) => {
  res.status(status).type("html").send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; display: flex; min-height: 100vh; align-items: center; justify-content: 
    center; color: #111; }
    .card { background: #fff; padding: 32px; border-radius: 16px; max-width: 420px; width: calc(100% - 32px); text-align: center; 
    box-shadow: 0 2px 16px rgba(0,0,0,.08); }
    h1 { font-size: 22px; margin: 0 0 12px; }
    p { color: #555; line-height: 1.5; }
    .btn { display: inline-block; margin-top: 16px; background: #0ea5e9; color: #fff; border: 0; padding: 12px 24px; border-radius: 
    8px; font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none; }
    .btn.secondary { background: transparent; color: #0ea5e9; }
  </style>
</head>
<body><div class="card">${body}</div></body>
</html>`);
};

const backToShop = () =>
  `<a class="btn secondary" href="${escapeHtml(frontendUrl())}">Back to the shop</a>`;

const readQuery = (value: unknown) => (typeof value === "string" ? value : "");

// ===== الاشتراك =====

export const subscribeToNewsletter = async (req: Request, res: Response) => {
  try {
    await subscribe(String(req.body?.email ?? ""));
    // نفس الرد لكل الحالات: لا يكشف إن كان البريد في القائمة
    res.status(200).json({
      message: "Almost done! Check your inbox to confirm your subscription.",
    });
  } catch (err) {
    handleError(err, res);
  }
};

// ===== التأكيد =====
// GET يعرض زرًا فقط، وPOST ينفّذ: برامج البريد تفتح الروابط آليًا لفحصها،
// ولو نفّذ GET مباشرة لتأكد الاشتراك دون أن يضغط صاحب البريد أي شيء

export const showConfirmPage = (req: Request, res: Response) => {
  const token = readQuery(req.query.token);
  const action = `/newsletter/confirm?token=${encodeURIComponent(token)}`;
  renderPage(
    res,
    200,
    "Confirm your subscription",
    `<h1>Confirm your subscription</h1>
     <p>Click the button below to start receiving our newsletter.</p>
     <form method="post" action="${escapeHtml(action)}">
       <button class="btn" type="submit">Confirm subscription</button>
     </form>`,
  );
};

export const confirmNewsletter = async (req: Request, res: Response) => {
  try {
    const ok = await confirmSubscription(readQuery(req.query.token));
    if (ok) {
      renderPage(
        res,
        200,
        "Subscription confirmed",
        `<h1>You're subscribed! 🎉</h1>
         <p>Thanks for confirming. You'll now receive our latest products and offers.</p>
         ${backToShop()}`,
      );
    } else {
      renderPage(
        res,
        400,
        "Link expired",
        `<h1>This link is invalid or has expired</h1>
         <p>Confirmation links are valid for 48 hours and can only be used once. Subscribe again from the shop to get a new one.</p>
         ${backToShop()}`,
      );
    }
  } catch (err) {
    console.error("[newsletter] Confirm failed:", err);
    renderPage(
      res,
      500,
      "Error",
      `<h1>Something went wrong</h1><p>Please try again later.</p>${backToShop()}`,
    );
  }
};

// ===== إلغاء الاشتراك =====
// نفس المبدأ: GET يعرض زرًا، وPOST ينفّذ

export const showUnsubscribePage = (req: Request, res: Response) => {
  const id = readQuery(req.query.id);
  const token = readQuery(req.query.token);
  const action = `/newsletter/unsubscribe?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`;
  renderPage(
    res,
    200,
    "Unsubscribe",
    `<h1>Unsubscribe from our newsletter?</h1>
     <p>You'll stop receiving product news and offers by email.</p>
     <form method="post" action="${escapeHtml(action)}">
       <button class="btn" type="submit">Unsubscribe</button>
     </form>
     ${backToShop()}`,
  );
};

export const unsubscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const ok = await unsubscribe(
      readQuery(req.query.id),
      readQuery(req.query.token),
    );
    if (ok) {
      renderPage(
        res,
        200,
        "Unsubscribed",
        `<h1>You've been unsubscribed</h1>
         <p>You won't receive any more newsletter emails from us.</p>
         ${backToShop()}`,
      );
    } else {
      renderPage(
        res,
        400,
        "Invalid link",
        `<h1>This unsubscribe link is invalid</h1>
         <p>Please use the link from the most recent email you received.</p>
         ${backToShop()}`,
      );
    }
  } catch (err) {
    console.error("[newsletter] Unsubscribe failed:", err);
    renderPage(
      res,
      500,
      "Error",
      `<h1>Something went wrong</h1><p>Please try again later.</p>${backToShop()}`,
    );
  }
};
