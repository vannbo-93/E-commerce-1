/** @format */
import type { Request, Response } from "express";
import { createContactMessage } from "../services/contactService.js";
import { handleError } from "../utils/handleError.js";

const str = (value: unknown) => (typeof value === "string" ? value : "");

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
