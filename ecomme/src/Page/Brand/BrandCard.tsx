/** @format */

const BrandCard = ({ img }: { img: string }) => {
  return (
    <div
      className="
        flex items-center justify-center
        rounded-xl
        border border-black-100
        bg-sky-100
        p-4
        cursor-pointer
        transition-all duration-200
        hover:-translate-y-1
        hover:bg-sky-200
        hover:shadow-lg
      ">
      <img
        src={img}
        alt="Brand"
        className="h-auto w-full rounded-lg object-contain"
      />
    </div>
  );
};

export default BrandCard;
