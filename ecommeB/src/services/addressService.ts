/** @format */
import mongoose from "mongoose";
import Address, { type IAddress } from "../models/addressModel.js";
import { AppError } from "../utils/AppError.js";

const MAX_ADDRESSES = 10;
// أرقام ومسافات وشرطات، مع + اختيارية في البداية
const PHONE_PATTERN = /^\+?[0-9\s-]{6,20}$/;

export interface AddressInput {
  label: string;
  fullName: string;
  phone: string;
  city: string;
  street: string;
  postalCode: string;
}

export interface AddressResponse extends AddressInput {
  _id: string;
  isDefault: boolean;
}

const toResponse = (a: IAddress): AddressResponse => ({
  _id: a._id.toString(),
  label: a.label,
  fullName: a.fullName,
  phone: a.phone,
  city: a.city,
  street: a.street,
  postalCode: a.postalCode,
  isDefault: a.isDefault,
});

const assertValidId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Address not found", 404);
  }
};

const validate = (input: AddressInput): AddressInput => {
  const clean: AddressInput = {
    label: input.label.trim() || "Home",
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    city: input.city.trim(),
    street: input.street.trim(),
    postalCode: input.postalCode.trim(),
  };

  if (!clean.fullName) throw new AppError("Recipient name is required", 400);
  if (!clean.phone) throw new AppError("Phone number is required", 400);
  if (!PHONE_PATTERN.test(clean.phone)) {
    throw new AppError("Please enter a valid phone number", 400);
  }
  if (!clean.city) throw new AppError("City is required", 400);
  if (!clean.street) throw new AppError("Address is required", 400);

  return clean;
};

// الافتراضي أولًا، ثم الأحدث
export const listAddresses = async (
  userId: string,
): Promise<AddressResponse[]> => {
  const addresses = await Address.find({ user: userId }).sort({
    isDefault: -1,
    _id: -1,
  });
  return addresses.map(toResponse);
};

// كل استعلام يتضمن user: عنوان مستخدم آخر يعود 404 كأنه غير موجود
const findOwned = async (userId: string, id: string) => {
  assertValidId(id);
  const address = await Address.findOne({ _id: id, user: userId });
  if (!address) throw new AppError("Address not found", 404);
  return address;
};

export const getAddress = async (
  userId: string,
  id: string,
): Promise<AddressResponse> => toResponse(await findOwned(userId, id));

// يلغي الافتراضي الحالي أولًا، ثم يعيّن الجديد: بالعكس سيرفضه الفهرس الفريد الجزئي
const makeDefault = async (userId: string, id: string) => {
  await Address.updateMany(
    { user: userId, isDefault: true, _id: { $ne: id } },
    { $set: { isDefault: false } },
  );
  await Address.updateOne(
    { _id: id, user: userId },
    { $set: { isDefault: true } },
  );
};

export const createAddress = async (
  userId: string,
  input: AddressInput,
  setAsDefault: boolean,
): Promise<AddressResponse> => {
  const clean = validate(input);

  const count = await Address.countDocuments({ user: userId });
  if (count >= MAX_ADDRESSES) {
    throw new AppError(
      `You can save up to ${MAX_ADDRESSES} addresses. Delete one to add another.`,
      400,
    );
  }

  const address = await Address.create({ ...clean, user: userId });

  // أول عنوان يصبح افتراضيًا دائمًا، حتى لا يبقى مستخدم بعناوين دون افتراضي
  if (setAsDefault || count === 0) {
    await makeDefault(userId, address._id.toString());
    address.isDefault = true;
  }

  return toResponse(address);
};

export const updateAddress = async (
  userId: string,
  id: string,
  input: AddressInput,
  setAsDefault: boolean,
): Promise<AddressResponse> => {
  const clean = validate(input);
  const address = await findOwned(userId, id);

  address.set(clean);
  await address.save();

  if (setAsDefault && !address.isDefault) {
    await makeDefault(userId, id);
    address.isDefault = true;
  }

  return toResponse(address);
};

export const setDefaultAddress = async (
  userId: string,
  id: string,
): Promise<AddressResponse[]> => {
  await findOwned(userId, id);
  await makeDefault(userId, id);
  return listAddresses(userId);
};

export const deleteAddress = async (
  userId: string,
  id: string,
): Promise<AddressResponse[]> => {
  const address = await findOwned(userId, id);
  const wasDefault = address.isDefault;
  await address.deleteOne();

  // حُذف الافتراضي: الأحدث من الباقية يأخذ مكانه
  if (wasDefault) {
    const next = await Address.findOne({ user: userId }).sort({ _id: -1 });
    if (next) await makeDefault(userId, next._id.toString());
  }

  return listAddresses(userId);
};
