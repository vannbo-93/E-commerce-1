/** @format */
import User, { type IUser } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import { AppError } from "../utils/AppError.js";
import { deleteImage } from "../utils/imageStorage.js";

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// الشكل الآمن للمستخدم الذي نُعيده للفرونت إند، بلا كلمة المرور أبدًا
export interface SafeUser {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar: string;
}

const toSafeUser = (user: IUser): SafeUser => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
  role: user.role,
  avatar: user.avatar ?? "",
});

const isDuplicateKeyError = (err: unknown) =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  (err as { code: unknown }).code === 11000;

// bcrypt يتجاهل كل ما بعد أول 72 بايت: كلمتا مرور تتطابقان في أول 72 بايت
// ستُقبلان كأنهما واحدة. نرفض الأطول بدل أن نقبلها ونقصّها بصمت.
const assertValidPassword = (password: string, label = "Password") => {
  if (password.length < 6) {
    throw new AppError(`${label} must be at least 6 characters`, 400);
  }
  if (Buffer.byteLength(password, "utf8") > 72) {
    throw new AppError(`${label} is too long (maximum 72 characters)`, 400);
  }
};

export const registerUser = async (
  data: RegisterInput,
): Promise<{ user: SafeUser; token: string }> => {
  assertValidPassword(data.password);

  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  // كلمة المرور تُشفَّر تلقائيًا هنا عبر الـ pre("save") hook داخل userModel.ts
  let user: IUser;
  try {
    user = await User.create(data);
  } catch (err) {
    // طلبا تسجيل متزامنان بنفس البريد: كلاهما مرّ من findOne، والفهرس الفريد يرفض الثاني
    if (isDuplicateKeyError(err)) {
      throw new AppError("Email already in use", 409);
    }
    throw err;
  }

  const token = generateToken({ id: user._id.toString(), role: user.role });

  return { user: toSafeUser(user), token };
};

export const loginUser = async (
  data: LoginInput,
): Promise<{ user: SafeUser; token: string }> => {
  // password مطلوبة صراحة هنا لأنها select: false في الموديل
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) {
    // رسالة عامة متعمّدة: لا تكشف إن كان البريد موجودًا أصلًا أم لا
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({ id: user._id.toString(), role: user.role });

  return { user: toSafeUser(user), token };
};

// يُستخدم من مسار /me: التوكن يحمل فقط id وrole، فنجلب باقي البيانات من قاعدة البيانات
export const getCurrentUser = async (id: string): Promise<SafeUser> => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return toSafeUser(user);
};

// تعديل الاسم فقط؛ البريد للعرض (تغييره يحتاج تأكيدًا عبر البريد الجديد)
export const updateProfile = async (
  id: string,
  data: { username: string },
): Promise<SafeUser> => {
  const username = data.username.trim();
  if (username.length < 3 || username.length > 30) {
    throw new AppError("Username must be between 3 and 30 characters", 400);
  }

  const user = await User.findByIdAndUpdate(
    id,
    { username },
    { new: true, runValidators: true },
  );
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return toSafeUser(user);
};

export const changePassword = async (
  id: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ user: SafeUser; token: string }> => {
  if (!currentPassword || !newPassword) {
    throw new AppError("Current and new password are required", 400);
  }
  assertValidPassword(newPassword, "New password");

  const user = await User.findById(id).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // 400 لا 401: الفرونت إند يفسّر 401 كانتهاء الجلسة، وهذا مجرد إدخال خاطئ
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 400);
  }
  if (await user.comparePassword(newPassword)) {
    throw new AppError(
      "New password must be different from the current one",
      400,
    );
  }

  user.password = newPassword;
  // ثانية واحدة للخلف: iat في التوكن بالثواني لا بالمللي ثانية،
  // فبدونها قد يُرفض التوكن الجديد الذي نصدره بعد سطرين
  user.passwordChangedAt = new Date(Date.now() - 1000);

  // save() لا update: الـ pre("save") hook هو الذي يشفّر كلمة المرور
  await user.save();

  // توكن جديد للجلسة الحالية: كل الجلسات الأخرى أصبحت مرفوضة في protect
  const token = generateToken({ id: user._id.toString(), role: user.role });
  return { user: toSafeUser(user), token };
};

// يضع صورة جديدة، ويحذف القديمة بعد نجاح الحفظ فقط
export const setAvatar = async (
  id: string,
  avatarUrl: string,
): Promise<SafeUser> => {
  const previous = await User.findById(id).select("avatar");
  if (!previous) {
    throw new AppError("User not found", 404);
  }

  const user = await User.findByIdAndUpdate(
    id,
    { avatar: avatarUrl },
    { new: true },
  );
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (previous.avatar && previous.avatar !== avatarUrl) {
    await deleteImage(previous.avatar);
  }
  return toSafeUser(user);
};

export const removeAvatar = async (id: string): Promise<SafeUser> => {
  const previous = await User.findById(id).select("avatar");
  if (!previous) {
    throw new AppError("User not found", 404);
  }

  const user = await User.findByIdAndUpdate(id, { avatar: "" }, { new: true });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (previous.avatar) {
    await deleteImage(previous.avatar);
  }
  return toSafeUser(user);
};
