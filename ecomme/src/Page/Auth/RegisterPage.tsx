/** @format */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Api/baseURL";
import { useAuth } from "../../context/AuthContext";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode,} from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string };

const AuthCard = ({ title, subtitle, children,}: { title: string; subtitle: string; children: ReactNode;
}) => (
  <div className="w-full px-4 pt-10 pb-16">
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  </div>
);

const AuthInput = ({ label, id, className = "", ...props }: AuthInputProps) => (
  <label
    htmlFor={id}
    className="flex flex-col gap-1 text-sm font-medium text-gray-700">
    {label}
    <input
      id={id}
      className={`rounded-md border border-gray-300 px-3 py-2 font-normal outline-none focus:border-sky-500 focus:ring-1 
        focus:ring-sky-500 ${className}`}
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
    className={`rounded-md bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed 
    disabled:opacity-50 ${className}`}>
    {children}
  </button>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await api.post("/user/register", {
        username,
        email,
        password,
      });
      const user = res.data.user;

      // تسجيل دخول تلقائي فور النجاح: الباك إند يضبط الكوكي مباشرة عند /register أيضًا
      login(user);

      // كل حساب جديد role: user افتراضيًا (لا يمكن التسجيل كأدمن من هذا النموذج)
      navigate("/user/allorders");
    } catch (err: unknown) {
      const response = (
        err as {
          response?: { data?: { message?: string } };
        }
      ).response;
      setError(response?.data?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Create an account" subtitle="Register to start shopping">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && (
          <div
            role="alert"
            className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <AuthInput
          id="username"
          label="Username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
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
          autoComplete="new-password"
          minLength={6}
          required
        />
        <AuthButton type="submit" disabled={submitting} className="mt-2 mb-5">
          {submitting ? "Creating account..." : "Create account"}
        </AuthButton>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-sky-600 hover:text-sky-700">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
};

export default RegisterPage;
