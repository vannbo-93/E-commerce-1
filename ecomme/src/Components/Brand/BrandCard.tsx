/** @format */

const BrandCard = ({ img }: { img: string }) => {
  return (
    <div className="col-6 col-md-4 col-lg-2 my-2 d-flex justify-content-center  ">
      <div
        className="my-1 "
        style={{
          width: "100%",
          height: "151px",
          borderRadius: "8px",
          border: "none",
        }}>
        <img style={{ width: "100%", height: "151px" }} src={img} alt="Brand" />
      </div>
    </div>
  );
};

export default BrandCard;
