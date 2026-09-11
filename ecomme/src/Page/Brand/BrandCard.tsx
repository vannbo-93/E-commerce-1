/** @format */

const BrandCard = ({ img }: { img: string }) => {
  return (
    <div className="flex justify-center my-2">
      <img
        src={img}
        alt="Brand"
        className="w-full rounded-lg object-cover"
        style={{ height: "151px" }}
      />
    </div>
  );
};

export default BrandCard;
