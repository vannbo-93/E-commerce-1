/** @format */

import { Link } from "react-router-dom";
import { useState } from "react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {e.preventDefault();// TODO: استدعاء API التسجيل
};
  return (
    <div className="min-h-[900px]">
      <form onSubmit={handleSubmit} className="py-5 flex justify-center">
        <div className="flex flex-col">
          <label className="mx-auto font-bold text-xl">register a new account</label>

          <input placeholder="Username..." type="text" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-3 mx-auto text-center border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input placeholder="Email..." type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="my-3 mx-auto text-center border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input placeholder="The secret word..." type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mx-auto text-center border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

          <button type="submit"
            className="mx-auto mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors">account registration
          </button>

          <label className="mx-auto my-4">Do you already have an account?{" "}
            <Link to="/login" className="no-underline"><span className="cursor-pointer text-red-600">Click here</span></Link>
          </label>
        </div>
      </form>
    </div>
  );
};
export default RegisterPage;
