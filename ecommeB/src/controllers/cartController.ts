/** @format */
import type { Request, Response } from "express";
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../services/CartService.js";
import { handleError } from "../utils/HandleError.js";

// كل المسارات خلف protect، فـ req.user موجود دائمًا هنا

export const getMyCart = async (req: Request, res: Response) => {
  try {
    const cart = await getCart(req.user!.id);
    res.status(200).json({ cart });
  } catch (err) {
    handleError(err, res);
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, color } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await addToCart(req.user!.id, {
      productId: String(productId),
      quantity: quantity === undefined ? 1 : Number(quantity),
      ...(color ? { color: String(color) } : {}),
    });

    res.status(200).json({ message: "Added to cart", cart });
  } catch (err) {
    handleError(err, res);
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const cart = await updateCartItemQuantity(
      req.user!.id,
      req.params.itemId as string,
      Number(req.body.quantity),
    );
    res.status(200).json({ cart });
  } catch (err) {
    handleError(err, res);
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    const cart = await removeCartItem(
      req.user!.id,
      req.params.itemId as string,
    );
    res.status(200).json({ cart });
  } catch (err) {
    handleError(err, res);
  }
};

export const clearMyCart = async (req: Request, res: Response) => {
  try {
    const cart = await clearCart(req.user!.id);
    res.status(200).json({ cart });
  } catch (err) {
    handleError(err, res);
  }
};
