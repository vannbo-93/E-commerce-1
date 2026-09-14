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
import CartPage from "../src/Page/cart/CartPage";
import ChoosePayMethoudPage from "../src/Page/Checkout/ChoosePayMethoudPage";
import AdminAllProductsPage from "./Page/Admin/AdminAllProductsPage";

// Placeholder admin components are not yet implemented in this app so the admin
// routes are guarded behind a simple conditional component to avoid TS errors.
// const AdminLayout = () => <>{null}</const>;
// const AdminAllOrdersPage = () => null;
// const AddBrandPage = () => null;
// const AddCategoryPage = () => null;
// const AddSubcategoryPage = () => null;
// const AddProductPage = () => null;

function App() {
  return (
    <div className="min-h-screen flex flex-col" dir="ltr">
      <BrowserRouter>
        <NavBarLogo />
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
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/order/paymethoud"
              element={<ChoosePayMethoudPage />}
            />
            <Route
              path="/admin/allproducts"
              element={<AdminAllProductsPage />}
            />
            {/* <Route path="/admin" element={<AdminLayout />}>
              <Route path="allorders" element={<AdminAllOrdersPage />} />
              <Route path="allproducts" element={<AdminAllProductsPage />} />
              <Route path="addbrand" element={<AddBrandPage />} />
              <Route path="addcategory" element={<AddCategoryPage />} />
              <Route path="addsubcategory" element={<AddSubcategoryPage />} />
              <Route path="addproducts" element={<AddProductPage />} />
            </Route> */}
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
