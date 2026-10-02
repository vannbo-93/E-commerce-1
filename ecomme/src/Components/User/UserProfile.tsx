/** @format */
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import api from "../../Api/baseURL";
import { useAuth, type AuthUser } from "../../context/AuthContext";
import UserAvatar from "../Utility/UserAvatar";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 disabled:cursor-not-allowed disabled:opacity-60";

const buttonClass =
  "rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500";

const cardClass =
  "rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.08)] md:p-6";

type Status = "idle" | "submitting" | "success" | "error";

const errorMessage = (err: unknown) =>
  isAxiosError(err)
    ? (err.response?.data?.message ?? "Something went wrong")
    : "Something went wrong";

const Feedback = ({ status, text }: { status: Status; text: string }) =>
  text ? (
    <p
      role={status === "error" ? "alert" : "status"}
      className={`text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`}>
      {text}
    </p>
  ) : null;

// ===== الصورة الشخصية =====

const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVATAR_MAX_BYTES = 2 * 1024 * 1024; // نفس حد الباك إند

const PhotoForm = ({ user }: { user: AuthUser }) => {
  const { login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState<"upload" | "remove" | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [text, setText] = useState("");

  const run = async (
    kind: "upload" | "remove",
    request: () => Promise<AuthUser>,
  ) => {
    setBusy(kind);
    setStatus("idle");
    setText("");
    try {
      // يحدّث المستخدم في AuthContext: الصورة تتغير فورًا في الـ NavBar أيضًا
      login(await request());
      setStatus("success");
      setText(kind === "upload" ? "Photo updated." : "Photo removed.");
    } catch (err) {
      setStatus("error");
      setText(errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // يسمح باختيار نفس الملف مجددًا
    if (!file) return;

    // تحقق مسبق: رسالة فورية بدل انتظار رفض الباك إند
    if (!AVATAR_TYPES.includes(file.type)) {
      setStatus("error");
      setText("Please choose a JPEG, PNG or WEBP image.");
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setStatus("error");
      setText("Image is too large (maximum 2 MB).");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    void run("upload", async () => {
      const res = await api.patch("/user/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.user;
    });
  };

  const handleRemove = () =>
    run("remove", async () => {
      const res = await api.delete("/user/me/avatar");
      return res.data.user;
    });

  return (
    <section className={cardClass}>
      <h2 className="text-lg font-semibold text-gray-900">Profile photo</h2>

      <div className="mt-4 flex flex-wrap items-center gap-5">
        <div className={`relative ${busy ? "opacity-60" : ""}`}>
          <UserAvatar name={user.username} src={user.avatar} size={80} />
          {busy === "upload" && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-white/60 text-xs font-medium 
            text-gray-700">
              Uploading...
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={AVATAR_TYPES.join(",")}
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy !== null}
              className={buttonClass}>
              {user.avatar ? "Change photo" : "Upload photo"}
            </button>
            {user.avatar && (
              <button
                type="button"
                onClick={() => void handleRemove()}
                disabled={busy !== null}
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors 
                hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                {busy === "remove" ? "Removing..." : "Remove"}
              </button>
            )}
          </div>
          <span className="text-xs text-gray-400">
            JPEG, PNG or WEBP, up to 2 MB. Shown next to your reviews.
          </span>
          <Feedback status={status} text={text} />
        </div>
      </div>
    </section>
  );
};

// ===== بيانات الحساب =====

const AccountForm = ({ user }: { user: AuthUser }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState(user.username);
  const [status, setStatus] = useState<Status>("idle");
  const [text, setText] = useState("");
  const submittingRef = useRef(false);

  const trimmed = username.trim();
  const unchanged = trimmed === user.username;
  const valid = trimmed.length >= 3 && trimmed.length <= 30;
  const submitting = status === "submitting";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (unchanged || !valid || submittingRef.current) return;

    submittingRef.current = true;
    setStatus("submitting");
    setText("");

    try {
      const res = await api.patch("/user/me", { username: trimmed });
      // يحدّث الاسم في AuthContext: الـ NavBar وقائمة الحساب يتحدثان فورًا
      login(res.data.user);
      setStatus("success");
      setText("Profile updated.");
    } catch (err) {
      setStatus("error");
      setText(errorMessage(err));
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={cardClass}>
      <h2 className="text-lg font-semibold text-gray-900">Account details</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="profile-username"
            className="text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="profile-username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (status !== "submitting") {
                setStatus("idle");
                setText("");
              }
            }}
            maxLength={30}
            autoComplete="username"
            disabled={submitting}
            className={inputClass}
          />
          {!valid && (
            <span className="text-xs text-red-600">
              Must be between 3 and 30 characters.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="profile-email"
            className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="profile-email"
            value={user.email}
            disabled
            className={inputClass}
          />
          <span className="text-xs text-gray-400">
            Contact support if you need to change your email.
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={unchanged || !valid || submitting}
          className={buttonClass}>
          {submitting ? "Saving..." : "Save changes"}
        </button>
        <Feedback status={status} text={text} />
      </div>
    </form>
  );
};

// ===== تغيير كلمة المرور =====

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  disabled: boolean;
  hint?: string;
}

const PasswordField = ({
  id,
  label,
  value,
  onChange,
  autoComplete,
  disabled,
  hint,
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={72}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`${inputClass} pr-10`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md 
          text-gray-400 hover:text-gray-600">
          {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </button>
      </div>
      {hint && <span className="text-xs text-red-600">{hint}</span>}
    </div>
  );
};

const PasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [text, setText] = useState("");
  const submittingRef = useRef(false);

  const submitting = status === "submitting";
  const tooShort = newPassword !== "" && newPassword.length < 6;
  const mismatch = confirmPassword !== "" && confirmPassword !== newPassword;
  const canSubmit =
    currentPassword !== "" &&
    newPassword.length >= 6 &&
    confirmPassword === newPassword &&
    !submitting;

  const resetFeedback = () => {
    if (status !== "submitting") {
      setStatus("idle");
      setText("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submittingRef.current) return;

    submittingRef.current = true;
    setStatus("submitting");
    setText("");

    try {
      await api.patch("/user/me/password", { currentPassword, newPassword });
      setStatus("success");
      setText("Password changed. You've been signed out on all other devices.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setStatus("error");
      setText(errorMessage(err));
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={cardClass}>
      <h2 className="text-lg font-semibold text-gray-900">Change password</h2>

      <div className="mt-4 flex max-w-md flex-col gap-4">
        <PasswordField
          id="current-password"
          label="Current password"
          value={currentPassword}
          onChange={(v) => {
            setCurrentPassword(v);
            resetFeedback();
          }}
          autoComplete="current-password"
          disabled={submitting}
        />
        <PasswordField
          id="new-password"
          label="New password"
          value={newPassword}
          onChange={(v) => {
            setNewPassword(v);
            resetFeedback();
          }}
          autoComplete="new-password"
          disabled={submitting}
          {...(tooShort ? { hint: "At least 6 characters." } : {})}
        />
        <PasswordField
          id="confirm-password"
          label="Confirm new password"
          value={confirmPassword}
          onChange={(v) => {
            setConfirmPassword(v);
            resetFeedback();
          }}
          autoComplete="new-password"
          disabled={submitting}
          {...(mismatch ? { hint: "Passwords don't match." } : {})}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={!canSubmit} className={buttonClass}>
          {submitting ? "Changing..." : "Change password"}
        </button>
        <Feedback status={status} text={text} />
      </div>
    </form>
  );
};

// ===== الصفحة =====

const UserProfile = () => {
  const { user } = useAuth();

  // RequireAuth يضمن وجود المستخدم هنا، لكن نتحقق للأمان
  if (!user) return null;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-gray-900">Profile</h1>
      <PhotoForm user={user} />
      {/* key: يعيد ضبط النموذج إن تغيّر المستخدم (تسجيل دخول بحساب آخر) */}
      <AccountForm key={user.id} user={user} />
      <PasswordForm />
    </div>
  );
};

export default UserProfile;
