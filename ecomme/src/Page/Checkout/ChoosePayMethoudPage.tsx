/** @format */
import ChoosePayMethoud from "../../Components/Checkout/ChoosePayMethoud";

// لا مجموع يُمرَّر عبر الرابط: صفحة الدفع تقرأ السلة من CartContext،
// والباك إند يحسب المبلغ النهائي عند إنشاء الطلب
const ChoosePayMethoudPage = () => <ChoosePayMethoud />;

export default ChoosePayMethoudPage;
