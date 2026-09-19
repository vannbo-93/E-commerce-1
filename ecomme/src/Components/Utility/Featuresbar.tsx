/** @format */
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

const features = [
  {
    icon: LocalShippingOutlinedIcon,
    title: "Free Shipping",
    text: "On orders over $40",
  },
  {
    icon: SupportAgentOutlinedIcon,
    title: "24/7 Support",
    text: "We're here to help",
  },
  {
    icon: AutorenewOutlinedIcon,
    title: "Easy Returns",
    text: "30-day return policy",
  },
  {
    icon: VerifiedUserOutlinedIcon,
    title: "Secure Payment",
    text: "100% secure checkout",
  },
];

const FeaturesBar = () => {
  return (
    <div className="my-4 w-full rounded-2xl bg-white px-4 py-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-2 gap-y-5 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex items-center gap-3 px-2 lg:border-r lg:border-gray-100 lg:px-4 lg:last:border-r-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50">
              <Icon className="text-sky-500" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">{title}</div>
              <div className="text-xs text-gray-500">{text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesBar;
