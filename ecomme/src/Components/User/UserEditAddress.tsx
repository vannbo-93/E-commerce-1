/** @format */
import React, { useState } from "react";

const UserEditAddress = () => {
  const [form, setForm] = useState({
    label: "Home",
    details: "Let Al Amal knetra morocco",
    phone: "+212667500649",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: call API to save the changes
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start">
      <div className=" text-lg font-bold text-white mb-4">Edit Address</div>

      <div className="w-full sm:w-8/12 flex flex-col">
        <input
          type="text"
          name="label"
          value={form.label}
          onChange={handleChange}
          className="h-10 bg-[#2A2A3C] border border-gray-600 rounded-md px-3 text-white text-sm
           focus:outline-none focus:border-blue-400"
          placeholder="Address label, for example (Home - Work)"
        />
        <textarea
          name="details"
          value={form.details}
          onChange={handleChange}
          className="input-form-area p-2 mt-3 h-10 bg-[#2A2A3C] border border-gray-600 rounded-md 
          px-3 text-white text-sm focus:outline-none focus:border-blue-400"
          rows={4}
          cols={50}
          placeholder="Address details"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="h-10 bg-[#2A2A3C] border border-gray-600 rounded-md px-3 text-white text-sm 
          focus:outline-none focus:border-blue-400"
          placeholder="Phone number"
        />
      </div>

      <div className="w-full sm:w-8/12 flex justify-end">
        <button
          type="submit"
          className=" h-10 px-6 rounded-md bg-blue-500 text-white 
          text-sm font-semibold hover:bg-blue-600 transition-colors mt-6">
          {" "}
          Save Address Changes
        </button>
      </div>
    </form>
  );
};
export default UserEditAddress;
