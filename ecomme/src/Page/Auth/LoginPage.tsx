/** @format */
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="min-h-screen">
      <div className="py-5 flex justify-center">
        <div className="flex flex-col">
          <label className="mx-auto font-bold text-xl">Log In</label>
          <input placeholder="email"  type="text"
            className="my-3 mx-auto text-center border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input placeholder="Password" type="password"
            className="my-3 mx-auto text-center border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

          <button className="mx-auto  mt-4 w-64 bg-blue-900 hover:bg-blue-800  text-white font-medium px-6 py-2 rounded-md transition-colors">
            Log In
          </button>

          <label className="mx-auto my-4 text-sm">
            {""} Don't have an account?{" "}
            <Link to="/register">
              <span className="cursor-pointer text-red-600 ms-1">Click here</span>
            </Link>
          </label>
        </div>
      </div>
      <div className="py-5 flex justify-center gap-3">
        <Link to="/admin/allproducts"
          className="bg-blue-800 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition-colors font-bold"> Login Admin
        </Link>

        <Link to="/user/allorders"
          className="bg-blue-800 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md 
          transition-colors font-bold"> Login User
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
