/** @format */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import saleblue from "../../../src/images/Slide/sale-bag-blue-tag.webp";

const DiscountBanner = () => {
  return (
    // الحاوية: تقيس النص حسب عرض اللافتة نفسها وليس عرض الشاشة
    <div
      className="relative flex min-h-[220px] w-full items-center justify-end overflow-hidden md:aspect-[3.1/1]"
      style={{ containerType: "inline-size" }}>
      <img
        className="absolute inset-0 h-full w-full object-cover object-left md:object-center" src={saleblue} alt=""/>

      {/* كل الأحجام بوحدة em، فيتناسب كل شيء مع عرض اللافتة */}
      <div
        className="relative flex w-1/2 flex-col items-end px-3 py-4 text-right md:pr-8"
        style={{ fontSize: "clamp(10px, 1.6cqw, 20px)" }}>
        <p
          className="font-semibold tracking-wide text-sky-600"
          style={{ fontSize: "1.1em", paddingBottom: "0.5em" }}>
          Special Offer
        </p>
        <h2
          className="font-extrabold text-gray-900"
          style={{ fontSize: "3.4em", lineHeight: 0.95, margin: "0.1em 0" }}>
          Up to 50% Off
        </h2>
        <p className="hidden text-gray-900 md:block" style={{ fontSize: "1em", marginTop: "0.6em" }}>
          Limited time offer on selected items.
          <br />
          Hurry up and grab the best deals!
        </p>
        <div
          className="flex cursor-pointer items-center justify-center rounded-lg bg-sky-500 font-medium text-white transition-colors hover:bg-sky-600"
          style={{ marginTop: "1em", width: "13em", padding: "0.8em 0", gap: "0.5em", fontSize: "1.05em",
          }}>
          <ArrowBackIcon style={{ width: "1.2em", height: "1.2em" }} />
          Shop the Sale
        </div>
      </div>
    </div>
  );
};

export default DiscountBanner;
