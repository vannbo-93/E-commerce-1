/** @format */

const ProductsText = () => {
  return (
    <div>
      <div className="mt-2">
        <div className="cat-text font-bold">Electronics:</div>
      </div>

      <div className="mt-2 flex flex-wrap">
        <div className="w-full md:w-8/12">
          <div className="cat-title inline">
            iPhone XR with 128GB of storage, supporting 4G LTE and FaceTime
            (Product) Red
            <span className="cat-rate inline mx-3">4.5</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className="w-full md:w-8/12 mt-4">
          <div className="cat-text inline">Brand:</div>
          <div className="barnd-text inline mx-1 font-bold"> Samsung</div>
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className="w-full md:w-8/12 mt-1 flex gap-2">
          <div
            className="w-6 h-6 rounded-full border cursor-pointer"
            style={{ backgroundColor: "#E52C2C" }}></div>
          <div
            className="w-6 h-6 rounded-full border cursor-pointer"
            style={{ backgroundColor: "white" }}></div>
          <div
            className="w-6 h-6 rounded-full border cursor-pointer"
            style={{ backgroundColor: "black" }}></div>
        </div>
      </div>

      <div className="mt-4">
        <div className="cat-text py-4 font-bold">Specifications:</div>
      </div>

      <div>
        <div className="w-full md:w-10/10">
          <div className="product-description block break-words leading-relaxed text-left">
            It features dual SIM support with one physical SIM and one eSIM. You
            can easily unlock your iPhone and sign in to apps, accounts, and
            more. Face ID is the fastest and most secure authentication method
            using facial recognition. It features the A12 Bionic chip, one of
            the smartest and most powerful smartphone chips. Its innovative
            sensor, ISP, and Neural Engine usher in a new era of photography,
            enabling you to capture unprecedented images. The single-lens camera
            keeps subjects in the foreground sharply in focus while creating a
            soft background blur. Overview
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap py-2">
        <div className="w-full">
          <div className="product-price inline px-3 py-3 border rounded-md transition-colors font-bold">
            34,000 MAD
          </div>
          <div className="product-cart-add bg-blue-800 hover:bg-blue-900 text-white px-3 py-3
           inline mx-3 cursor-pointer rounded-md transition-colors font-bold">
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsText;
