/** @format */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../src/Page/Home/HomePage";
import NavBarLogo from "./Components/Uitily/navbarlogo";

function App() {
  return (
    <>
      <NavBarLogo />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
