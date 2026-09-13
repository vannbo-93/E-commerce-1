/** @format */

const CategoryHeader = () => {
  return (
    <div className="cat-header">
      <div>
        <div>
          <div className="flex justify-start py-2 flex-nowrap 
          overflow-x-auto whitespace-nowrap p-2 gap-3">
            <div className="cat-text-header ">All</div>
            <div className="cat-text-header">Electronics</div>
            <div className="cat-text-header">Clothes</div>
            <div className="cat-text-header">Electrical</div>
            <div className="cat-text-header">Discounts</div>
            <div className="cat-text-header">More...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;
