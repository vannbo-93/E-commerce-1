/** @format */
import { isAxiosError } from "axios";

// نفس شكل رد الباك إند (addressService.ts → AddressResponse)
export interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
}

// رسالة الباك إند كما هي، لتُعرض للمستخدم مباشرة
export const toApiError = (err: unknown): Error =>
  new Error(
    isAxiosError(err)
      ? (err.response?.data?.message ?? "Something went wrong")
      : "Something went wrong",
  );
