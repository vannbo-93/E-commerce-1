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
import AdminAllOrdersPage from "./Page/Admin/AdminAllOrdersPage";
import AdminOrderDetalisPage from "./Page/Admin/AdminOrderDetalisPage ";
import AdminAddbrandPage from "../src/Page/Admin/AdminAddBrandPage";
import AdminAddCategoryPage from "../src/Page/Admin/AdminAddCategoryPage";
import AdminAddSubCategoryPage from "../src/Page/Admin/AdminAddSubCategoryPage";
import AdminAddProductsPage from "./Page/Admin/AdminAddProductsPage";
import UserAllOrdersPage from "./Page/User/UserAllOrdersPage";
import UserFavoriteProductsPage from "../src/Page/User/UserFavoriteProductsPage";
import UserAllAddressPage from "../src/Page/User/UserAllAddressPage";
import UserAddAddressPage from "../src/Page/User/UserAddAddressPage";
import UserEditAddressPage from "../src/Page/User/UserEditAddressPage";
import UserProfilePage from "../src/Page/User/UserProfilePage";

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
            <Route path="/admin/allorders" element={<AdminAllOrdersPage />} />
            <Route
              path="/admin/orders/:id"
              element={<AdminOrderDetalisPage />}
            />
            <Route path="/admin/addbrand" element={<AdminAddbrandPage />} />
            <Route
              path="/admin/addcategory"
              element={<AdminAddCategoryPage />}
            />
            <Route
              path="/admin/addsubcategory"
              element={<AdminAddSubCategoryPage />}
            />
            <Route
              path="/admin/addproducts"
              element={<AdminAddProductsPage />}
            />
            <Route path="/user/allorders" element={<UserAllOrdersPage />} />
            <Route
              path="/user/favoriteproducts"
              element={<UserFavoriteProductsPage />}
            />
            <Route path="/user/address" element={<UserAllAddressPage />} />
            <Route path="/user/add-address" element={<UserAddAddressPage />} />
            <Route
              path="/user/edit-address"
              element={<UserEditAddressPage />}
            />
            <Route path="/user/profile" element={<UserProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
