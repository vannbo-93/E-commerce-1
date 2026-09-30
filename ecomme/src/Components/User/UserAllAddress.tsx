/** @format */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconMapPin,
  IconPencil,
  IconPhone,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import api from "../../Api/baseURL";
import { toApiError, type Address } from "./addressApi";

const MAX_ADDRESSES = 10;

const UserAllAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/address")
      .then((res) => {
        if (!cancelled) setAddresses(res.data.addresses ?? []);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Failed to load your addresses.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // الحذف والتعيين الافتراضي يعيدان القائمة كاملة من الباك إند،
  // فالترتيب والعنوان الافتراضي يأتيان دائمًا من مصدر واحد
  const runAction = async (id: string, request: () => Promise<Address[]>) => {
    if (busyId) return;
    setBusyId(id);
    setActionError("");
    try {
      setAddresses(await request());
    } catch (err) {
      setActionError(toApiError(err).message);
    } finally {
      setBusyId(null);
    }
  };

  const handleSetDefault = (id: string) =>
    runAction(id, async () => {
      const res = await api.patch(`/address/${id}/default`);
      return res.data.addresses;
    });

  const handleDelete = (address: Address) => {
    const ok = window.confirm(
      `Delete the "${address.label}" address? This can't be undone.`,
    );
    if (!ok) return;
    void runAction(address._id, async () => {
      const res = await api.delete(`/address/${address._id}`);
      return res.data.addresses;
    });
  };

  const atLimit = addresses.length >= MAX_ADDRESSES;

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-xl font-bold text-gray-900">My Addresses</h1>
      {atLimit ? (
        <span className="text-sm text-gray-500">
          Limit of {MAX_ADDRESSES} addresses reached
        </span>
      ) : (
        <Link
          to="/user/add-address"
          className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold 
          text-white no-underline transition-colors hover:bg-sky-600">
          <IconPlus size={16} />
          Add address
        </Link>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        {header}
        <p className="py-10 text-center text-sm text-gray-500">
          Loading your addresses...
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col gap-5">
        {header}
        <p className="py-10 text-center text-sm text-red-600">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {header}

      {actionError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {actionError}
        </div>
      )}

      {addresses.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-14 text-center 
        shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-500">
            <IconMapPin size={28} />
          </div>
          <p className="text-base font-semibold text-gray-900">
            No saved addresses yet
          </p>
          <p className="text-sm text-gray-500">
            Add an address to use it at checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {addresses.map((address) => {
            const busy = busyId === address._id;
            return (
              <div
                key={address._id}
                className={`flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.08)] transition-opacity ${
                  busy ? "opacity-60" : ""
                } ${address.isDefault ? "ring-2 ring-sky-400" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900">
                    {address.label}
                  </span>
                  {address.isDefault && (
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-600">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    {address.fullName}
                  </span>
                  <span>{address.street}</span>
                  <span>
                    {address.city}
                    {address.postalCode ? `, ${address.postalCode}` : ""}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-gray-500">
                    <IconPhone size={14} />
                    {address.phone}
                  </span>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                  <Link
                    to={`/user/edit-address/${address._id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 
                    no-underline hover:bg-gray-100">
                    <IconPencil size={15} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(address)}
                    disabled={busyId !== null}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 
                    hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
                    <IconTrash size={15} />
                    Delete
                  </button>
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => void handleSetDefault(address._id)}
                      disabled={busyId !== null}
                      className="ml-auto rounded-lg px-3 py-1.5 text-sm font-medium text-sky-600 hover:bg-sky-50 
                      disabled:cursor-not-allowed disabled:opacity-50">
                      Set as default
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserAllAddress;
