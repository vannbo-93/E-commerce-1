/** @format */
import { useState, type ChangeEvent, type FormEvent } from "react";
import { IconPencil } from "@tabler/icons-react";

const UserProfile = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSavePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: call API to change the password
    console.log(passwords);
  };

  return (
    <div>
      <div className="text-lg font-bold text-white mb-4">Profile</div>
      <div className="bg-[#1E1E2E] border border-gray-700/50 rounded-2xl p-3 w-full">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center">
              <div className="p-2">Name:</div>
              <div className="p-2 item-delete-edit">Mohamed El Aissaoui</div>
            </div>
            <div className="flex items-center">
              <div className="p-2">Phone Number:</div>
              <div className="p-2 item-delete-edit">+212667500649</div>
            </div>
            <div className="flex items-center">
              <div className="p-2">Email:</div>
              <div className="p-2 item-delete-edit">isawimed@gmail.com</div>
            </div>
          </div>
          <button type="button" onClick={() => {
              /* TODO: enable edit mode */
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 
              text-blue-400 transition-colors hover:bg-blue-500 hover:text-white shrink-0">
            <IconPencil size={16} className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSavePassword} className="mt-5">
          <div className="w-10/12 sm:w-8/12 md:w-6/12 flex flex-col gap-2">
            <div className="admin-content-text">Change Password</div>
            <input  type="password"  name="oldPassword" value={passwords.oldPassword} onChange={handleChange}
              className="block h-10 bg-[#2A2A3C] border border-gray-600 rounded-md px-3 text-white text-sm 
        focus:outline-none focus:border-blue-400"
              placeholder="Enter your old password"/>
            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange}
              className="h-10 bg-[#2A2A3C] border border-gray-600 rounded-md px-3 text-white text-sm 
        focus:outline-none focus:border-blue-400"
              placeholder="Enter your new password"/>
          </div>
          <div className="w-10/12 sm:w-8/12 md:w-6/12 flex justify-end">
            <button type="submit" className="h-10 px-6 rounded-md bg-blue-500 text-white 
        text-sm font-semibold hover:bg-blue-600 transition-colors mt-6"> Save Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserProfile;
