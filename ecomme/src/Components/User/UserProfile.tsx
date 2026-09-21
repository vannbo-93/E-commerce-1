/** @format */
import { useState, type ChangeEvent, type FormEvent } from "react";
import { IconEye, IconEyeOff, IconPencil } from "@tabler/icons-react";

// TODO: replace with the logged-in user's data from the API.
const user = {
  name: "Mohamed El Aissaoui",
  phone: "+212667500649",
  email: "isawimed@gmail.com",
};

const MIN_PASSWORD_LENGTH = 8;

const baseField =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40";

interface PasswordFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  placeholder: string;
  autoComplete: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  error?: string;
}

const PasswordField = ({
  id,
  label,
  name,
  value,
  placeholder,
  autoComplete,
  onChange,
  hint,
  error,
}: PasswordFieldProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          aria-invalid={Boolean(error)}
          className={`h-10 pr-10 ${baseField}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:text-sky-600">
          {show ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </button>
      </div>
      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : (
        hint && <span className="text-xs text-gray-400">{hint}</span>
      )}
    </div>
  );
};

const UserProfile = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const newTooShort =
    passwords.newPassword !== "" &&
    passwords.newPassword.length < MIN_PASSWORD_LENGTH;
  const sameAsOld =
    passwords.newPassword !== "" &&
    passwords.newPassword === passwords.oldPassword;

  const newPasswordError = newTooShort
    ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
    : sameAsOld
      ? "The new password must be different from the old one."
      : "";

  const canSave =
    passwords.oldPassword !== "" &&
    passwords.newPassword.length >= MIN_PASSWORD_LENGTH &&
    !sameAsOld &&
    !saving;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    if (status) setStatus(null);
  };

  const handleSavePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setStatus(null);
    try {
      // TODO: await the real API call here to change the password.
      console.log("Change password requested");
      setPasswords({ oldPassword: "", newPassword: "" });
      setStatus({
        type: "success",
        message: "Your password has been updated.",
      });
    } catch {
      setStatus({
        type: "error",
        message:
          "We couldn't update your password. Check the old password and try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 text-lg font-bold text-gray-900">Profile</div>

      <div className="w-full rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-4">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-50 text-lg font-bold text-sky-600">
              {initials}
            </div>

            <dl className="grid min-w-0 grid-cols-[6.5rem_1fr] gap-x-2 gap-y-2 self-center text-sm">
              <dt className="text-gray-500">Name</dt>
              <dd className="min-w-0 break-words font-medium text-gray-900">
                {user.name}
              </dd>
              <dt className="text-gray-500">Phone</dt>
              <dd className="min-w-0 break-words font-medium text-gray-900">
                {user.phone}
              </dd>
              <dt className="text-gray-500">Email</dt>
              <dd className="min-w-0 break-words font-medium text-gray-900">
                {user.email}
              </dd>
            </dl>
          </div>

          <button
            type="button"
            aria-label="Edit profile"
            onClick={() => {
              /* TODO: enable edit mode */
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-sky-50 hover:text-sky-600">
            <IconPencil size={17} />
          </button>
        </div>

        <form
          onSubmit={handleSavePassword}
          className="mt-6 border-t border-gray-100 pt-6">
          <div className="flex max-w-md flex-col gap-4">
            <div className="font-bold text-gray-900">Change Password</div>

            {status && (
              <div
                role={status.type === "error" ? "alert" : "status"}
                className={`rounded-lg px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}>
                {status.message}
              </div>
            )}

            <PasswordField
              id="old-password"
              label="Old password"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handleChange}
              placeholder="Enter your old password"
              autoComplete="current-password"
            />
            <PasswordField
              id="new-password"
              label="New password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
              autoComplete="new-password"
              hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
              error={newPasswordError}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!canSave}
                className="h-10 rounded-lg bg-sky-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed 
                disabled:opacity-50 disabled:hover:bg-sky-500">
                {saving ? "Saving..." : "Save password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
