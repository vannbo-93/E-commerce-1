/** @format */
import { useState } from "react";
import { Link } from "react-router-dom";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string };

const AuthCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) => (
  <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md">
    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
    <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    <div className="mt-6">{children}</div>
  </div>
);

const AuthInput = ({ label, id, className = "", ...props }: AuthInputProps) => (
  <label
    htmlFor={id}
    className="flex flex-col gap-1 text-sm font-medium text-gray-700">
    {label}
    <input
      id={id}
      className={`rounded-md border border-gray-300 px-3 py-2 font-normal outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${className}`}
      {...props}
    />
  </label>
);

const AuthButton = ({
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`rounded-md bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700 ${className}`}>
    {children}
  </button>
);

const devLinkClass =
  "flex-1 rounded-md border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call the login API.
  };

  return (
    <div className="w-full px-4 pt-10 pb-16">
      <AuthCard
        title="Log in"
        subtitle="Enter your details to access your account">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <AuthInput
            id="email"
            label="Email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <AuthButton type="submit" className="mt-2 mb-5">
            {" "}
            Log in
          </AuthButton>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-sky-600 hover:text-sky-700">
            {" "}
            Register
          </Link>
        </p>

        {/* TODO: احذف هذا القسم قبل النشر (روابط التطوير فقط) */}
        <div className="mt-6 flex gap-3 border-t border-gray-100 pt-5">
          <Link to="/admin/allproducts" className={devLinkClass}>
            Login Admin
          </Link>
          <Link to="/user/allorders" className={devLinkClass}>
            Login User
          </Link>
        </div>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
