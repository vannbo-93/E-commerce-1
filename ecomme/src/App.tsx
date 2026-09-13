/** @format */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../src/Page/Home/HomePage";
import NavBarLogo from "./Components/Utility/navbarlogo";
import Footer from "./Components/Utility/Footer";
import LoginPage from "../src/Page/Auth/LoginPage";
import RegisterPage from "../src/Page/Auth/RegisterPage";
import AllCategoryPage from "./Page/Category/AllCategoryPage";
import AllBrandPage from "../src/Page/Brand/AllBrandPage";
import ShopProductsPage from "../src/Components/Products/ShopProductsPage";
import ProductDetailsPage from "../src/Components/Products/ProductDetailsPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col" dir="ltr">
      <NavBarLogo />

      <BrowserRouter>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/allcategory" element={<AllCategoryPage />} />
            <Route
              path="/allbrand"
              element={<AllBrandPage title="All Brands" pathText="/allbrand" />}
            />
            <Route path="/products" element={<ShopProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
