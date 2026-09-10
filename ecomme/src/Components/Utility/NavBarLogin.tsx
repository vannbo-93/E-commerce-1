/** @format */

import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import login from "../../images/login.png";
import cart from "../../images/cart.png";

const NavBarLogin = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <img src={logo} className="logo h-10" alt="sfvs" />
          </Link>
          {/* Toggle button - يظهر فقط على الشاشات الصغيرة (sm وأقل) */}
          <button
            className="sm:hidden text-white p-2"
            aria-controls="basic-navbar-nav"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {/* Collapse container */}
          <div
            id="basic-navbar-nav"
            className={`${
              isOpen ? "flex" : "hidden"
            } sm:flex flex-col sm:flex-row items-center gap-3 sm:gap-4 absolute sm:static top-16 left-0 w-full sm:w-auto bg-gray-900 
            sm:bg-transparent px-4 sm:px-0 py-4 sm:py-0`}>
            <input
              type="search"
              placeholder="ابحث..."
              aria-label="Search"
              className="w-full sm:w-64 text-center rounded-md px-3 py-1.5 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-4 sm:me-auto">
              <Link
                to="/login"
                className="flex items-center gap-1 text-white hover:text-gray-300">
                <img src={login} className="login-img h-6" alt="sfvs" />
                <p>Login</p>
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-1 text-white hover:text-gray-300">
                <img src={cart} className="login-img h-6" alt="sfvs" />
                <p>arabic</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBarLogin;
