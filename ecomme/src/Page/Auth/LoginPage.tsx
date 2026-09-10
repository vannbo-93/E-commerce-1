/** @format */

const LoginPage = () => {
  return (
    <div className="min-h-screen">
      <div className="py-5 flex justify-center">
        <div className="flex flex-col">
          <label className="mx-auto font-bold text-xl">Log In</label>
          <input
            placeholder="email"
            type="text"
            className="my-3 mx-auto text-center border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Password"
            type="password"
            className="my-3 mx-auto text-center border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="mx-auto  mt-4 w-64 bg-blue-900 hover:bg-blue-800  text-white font-medium px-6 py-2 rounded-md transition-colors">
            Log In
          </button>
          <label className="mx-auto my-4 text-sm">
            {""} Don't have an account?
            <span className="cursor-pointer text-red-600 ms-1">Click here</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
