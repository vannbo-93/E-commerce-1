/** @format */
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../Api/baseURL";
import AddressForm, { type AddressFormValues } from "./AddressForm";
import { toApiError, type Address } from "./addressApi";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; address: Address };

const UserEditAddress = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    api
      .get(`/address/${id}`)
      .then((res) => {
        if (!cancelled)
          setState({ status: "ready", address: res.data.address });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ status: "error", message: toApiError(err).message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (values: AddressFormValues) => {
    try {
      await api.put(`/address/${id}`, values);
    } catch (err) {
      throw toApiError(err);
    }
    navigate("/user/address");
  };

  const heading = (
    <h1 className="text-xl font-bold text-gray-900">Edit address</h1>
  );

  if (!id || state.status === "error") {
    return (
      <div className="flex flex-col gap-5">
        {heading}
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-red-600">
            {state.status === "error" ? state.message : "Address not found"}
          </p>
          <Link to="/user/address" className="text-sm font-medium text-sky-600">
            Back to my addresses
          </Link>
        </div>
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="flex flex-col gap-5">
        {heading}
        <p className="py-10 text-center text-sm text-gray-500">
          Loading address...
        </p>
      </div>
    );
  }

  const { address } = state;

  return (
    <div className="flex flex-col gap-5">
      {heading}
      <AddressForm
        // key: نموذج جديد لكل عنوان، فلا تبقى قيم عنوان سابق
        key={address._id}
        initialValues={{
          label: address.label,
          fullName: address.fullName,
          phone: address.phone,
          city: address.city,
          street: address.street,
          postalCode: address.postalCode,
          isDefault: address.isDefault,
        }}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        lockDefault={address.isDefault}
      />
    </div>
  );
};

export default UserEditAddress;
