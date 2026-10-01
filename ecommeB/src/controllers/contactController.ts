/** @format */
import type { Request, Response } from "express";
import {
  createContactMessage,
  listContactMessages,
  countUnreadMessages,
  updateContactMessageStatus,
} from "../services/contactService.js";
import { handleError } from "../utils/handleError.js";

const str = (value: unknown) => (typeof value === "string" ? value : "");

const int = (value: unknown): number | undefined => {
  const n = Number(value);
  return Number.isInteger(n) ? n : undefined;
};

// ===== عام: نموذج التواصل =====

export const submitContactMessage = async (req: Request, res: Response) => {
  try {
    // حقل مصيدة مخفي عن البشر: البرامج الآلية تملأ كل الحقول، فنتجاهل رسالتها بصمت
    if (str(req.body?.website) !== "") {
      return res
        .status(200)
        .json({ message: "Thanks! We'll get back to you soon." });
    }

    await createContactMessage({
      name: str(req.body?.name),
      email: str(req.body?.email),
      subject: str(req.body?.subject),
      message: str(req.body?.message),
    });

    res.status(201).json({ message: "Thanks! We'll get back to you soon." });
  } catch (err) {
    handleError(err, res);
  }
};

// ===== الأدمن =====

export const getContactMessages = async (req: Request, res: Response) => {
  try {
    const page = int(req.query.page);
    const limit = int(req.query.limit);
    const result = await listContactMessages({
      status: str(req.query.status),
      ...(page !== undefined ? { page } : {}),
      ...(limit !== undefined ? { limit } : {}),
    });
    res.status(200).json(result);
  } catch (err) {
    handleError(err, res);
  }
};

export const getUnreadCount = async (_req: Request, res: Response) => {
  try {
    res.status(200).json({ count: await countUnreadMessages() });
  } catch (err) {
    handleError(err, res);
  }
};

export const changeContactMessageStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const message = await updateContactMessageStatus(
      req.params.id as string,
      str(req.body?.status),
    );
    res.status(200).json({ message });
  } catch (err) {
    handleError(err, res);
  }
};
