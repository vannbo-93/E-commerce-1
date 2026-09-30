/** @format */
import { useNavigate } from "react-router-dom";
import api from "../../Api/baseURL";
import AddressForm, {
  EMPTY_ADDRESS,
  type AddressFormValues,
} from "./AddressForm";
import { toApiError } from "./addressApi";

const UserAddAddress = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: AddressFormValues) => {
    try {
      await api.post("/address", values);
    } catch (err) {
      throw toApiError(err);
    }
    navigate("/user/address");
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-gray-900">Add address</h1>
      <AddressForm
        initialValues={EMPTY_ADDRESS}
        submitLabel="Save address"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default UserAddAddress;
