/** @format */

import NavBarLogo from "../../Components/Home/NavBarLogo";
import Slide from "../../Components/Home/Slider";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <NavBarLogo />
      <Slide />
      <h1 className="text-4xl font-bold">WELCOME TO HOME PAGE</h1>
    </div>
  );
};

export default HomePage;
