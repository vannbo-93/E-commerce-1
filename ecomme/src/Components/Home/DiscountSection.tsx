/** @format */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import saleblue from "../../../src/images/Slide/sale-bag-blue-tag.webp";

const DiscountBanner = () => {
  return (
    <div className="relative  w-full aspect-[3.1/1] overflow-hidden">
      <img
        className="h-full w-full object-cover object-center"
        src={saleblue}
        alt=""
      />

      <div className="absolute inset-2 flex items-center justify-end pr-8">
        <div className="flex w-1/2 flex-col items-end pr-3 text-right md:pr-4">
          <p className="pb-3 text-sm font-semibold tracking-wide text-sky-400">
            Special Offer
          </p>
          <h2
            className="my-1 font-extrabold leading-[0.95] text-gray-900"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 11rem)" }}>
            Up to 50% Off
          </h2>
          <p className="hidden text-sm text-gray-900 md:block">
            Limited time offer on selected items.
            <br />
            Hurry up and grab the best deals!
          </p>
          <div className="mt-4 flex w-48 cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-500 py-3 font-medium text-white transition-colors hover:bg-sky-600">
            <ArrowBackIcon className="!h-4 !w-4" />
            Shop the Sale
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountBanner;
