/** @format */
import type { Request, Response } from "express";
import {
  listAddresses,
  getAddress,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  type AddressInput,
} from "../services/addressService.js";
import { handleError } from "../utils/handleError.js";

// نص فقط: لا كائنات تتحول إلى شروط MongoDB
const str = (value: unknown): string =>
  typeof value === "string" ? value : "";

const readInput = (body: unknown): AddressInput => {
  const b = (body ?? {}) as Record<string, unknown>;
  return {
    label: str(b.label),
    fullName: str(b.fullName),
    phone: str(b.phone),
    city: str(b.city),
    street: str(b.street),
    postalCode: str(b.postalCode),
  };
};

const wantsDefault = (body: unknown) =>
  (body as Record<string, unknown> | undefined)?.isDefault === true;

export const getMyAddresses = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ addresses: await listAddresses(req.user!.id) });
  } catch (err) {
    handleError(err, res);
  }
};

export const getMyAddress = async (req: Request, res: Response) => {
  try {
    const address = await getAddress(req.user!.id, req.params.id as string);
    res.status(200).json({ address });
  } catch (err) {
    handleError(err, res);
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    const address = await createAddress(
      req.user!.id,
      readInput(req.body),
      wantsDefault(req.body),
    );
    res.status(201).json({ message: "Address added", address });
  } catch (err) {
    handleError(err, res);
  }
};

export const editAddress = async (req: Request, res: Response) => {
  try {
    const address = await updateAddress(
      req.user!.id,
      req.params.id as string,
      readInput(req.body),
      wantsDefault(req.body),
    );
    res.status(200).json({ message: "Address updated", address });
  } catch (err) {
    handleError(err, res);
  }
};

export const makeDefaultAddress = async (req: Request, res: Response) => {
  try {
    const addresses = await setDefaultAddress(
      req.user!.id,
      req.params.id as string,
    );
    res.status(200).json({ addresses });
  } catch (err) {
    handleError(err, res);
  }
};

export const removeAddress = async (req: Request, res: Response) => {
  try {
    const addresses = await deleteAddress(
      req.user!.id,
      req.params.id as string,
    );
    res.status(200).json({ message: "Address deleted", addresses });
  } catch (err) {
    handleError(err, res);
  }
};
