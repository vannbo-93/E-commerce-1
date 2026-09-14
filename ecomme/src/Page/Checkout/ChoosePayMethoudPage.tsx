/** @format */
import ChoosePayMethoud from "../../Components/Checkout/ChoosePayMethoud";

const ChoosePayMethoudPage = () => {
  const handleConfirm = () => {
    // placeholder for payment confirmation flow
  };

  return (
    <div>
      <ChoosePayMethoud total={0} onConfirm={handleConfirm} />
    </div>
  );
};
export default ChoosePayMethoudPage;
