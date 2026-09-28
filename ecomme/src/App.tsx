/** @format */
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./routes/RequireAuth";
import RequireAdmin from "./routes/RequireAdmin";
import HomePage from "../src/Page/Home/HomePage";
import NavBarLogo from "./Components/Utility/NavBarLogo";
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
import AdminOrderDetalisPage from "../src/Page/Admin/AdminOrderDetalisPage";
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
import AllSubCategoryPage from "../src/Page/Category/AllSubCategoryPage";
import EditProduct from "../src/Page/Admin/EditProduct";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function App() {
  return (
    <div className="min-h-screen flex flex-col" dir="ltr">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <NavBarLogo />
              <main className="flex-1">
                <Routes>
                  {/* مسارات عامة، بلا أي حراسة */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/allcategory" element={<AllCategoryPage />} />
                  <Route
                    path="/allbrand"
                    element={
                      <AllBrandPage title="All Brands" pathText="/allbrand" />
                    }
                  />
                  <Route path="/products" element={<ShopProductsPage />} />
                  <Route
                    path="/products/:id"
                    element={<ProductDetailsPage />}
                  />
                  <Route path="/cart" element={<CartPage />} />
                  <Route
                    path="/order/paymethoud"
                    element={<ChoosePayMethoudPage />}
                  />

                  {/* مسارات الأدمن: محمية بـ RequireAdmin — تتحقق من /user/me ومن role */}
                  <Route element={<RequireAdmin />}>
                    <Route
                      path="/admin/allproducts"
                      element={<AdminAllProductsPage />}
                    />
                    <Route
                      path="/admin/allorders"
                      element={<AdminAllOrdersPage />}
                    />
                    <Route
                      path="/admin/orders/:id"
                      element={<AdminOrderDetalisPage />}
                    />
                    <Route
                      path="/admin/addbrand"
                      element={<AdminAddbrandPage />}
                    />
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
                    <Route
                      path="/admin/allsubcategories"
                      element={<AllSubCategoryPage />}
                    />
                    <Route
                      path="/admin/editproduct/:id"
                      element={<EditProduct />}
                    />
                  </Route>

                  {/* مسارات المستخدم: محمية بـ RequireAuth — تكفي هوية مسجّلة، بلا شرط role */}
                  <Route element={<RequireAuth />}>
                    <Route
                      path="/user/allorders"
                      element={<UserAllOrdersPage />}
                    />
                    <Route
                      path="/user/favoriteproducts"
                      element={<UserFavoriteProductsPage />}
                    />
                    <Route
                      path="/user/address"
                      element={<UserAllAddressPage />}
                    />
                    <Route
                      path="/user/add-address"
                      element={<UserAddAddressPage />}
                    />
                    <Route
                      path="/user/edit-address"
                      element={<UserEditAddressPage />}
                    />
                    <Route path="/user/profile" element={<UserProfilePage />} />
                  </Route>

                  {/* أي رابط غير معرّف: رسالة واضحة بدل صفحة فارغة بين الـ NavBar والـ Footer */}
                  <Route
                    path="*"
                    element={
                      <div className="flex flex-col items-center gap-3 py-24 text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          Page not found
                        </p>
                        <p className="text-sm text-gray-500">
                          The page you're looking for doesn't exist.
                        </p>
                        <Link
                          to="/"
                          className="mt-2 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-medium text-white no-underline 
                          hover:bg-sky-600">
                          Back to home
                        </Link>
                      </div>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
