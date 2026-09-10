/** @format */

import CategoryCard from "./CategoryCard";
import clothe1 from "../../images/clothe1.png";
import cream from "../../images/cream.png";
import laptop from "../../images/laptop.png";
import grands from "../../images/grands.png";
import pot from "../../images/pot.png";
const CategoryContainer = () => {
  return (
    <div className="my-3 min-h-screen" dir="rtl">
      <div>
        <div className="admin-content-text text-right font-bold p-4">
          All Category
        </div>
        <div className="grid grid-cols-4 gap-4 my-2 mx-12">
          <CategoryCard title="clothe" img={clothe1} />
          <CategoryCard title="shoes" img={cream} />
          <CategoryCard title="laptop" img={laptop} />
          <CategoryCard title="clothe" img={clothe1} />
          <CategoryCard title="grand" img={grands} />
          <CategoryCard title="pot" img={pot} />
          <CategoryCard title="shoes" img={cream} />
          <CategoryCard title="laptop" img={laptop} />
          <CategoryCard title="clothe" img={clothe1} />
          <CategoryCard title="grand" img={grands} />
          <CategoryCard title="grand" img={grands} />
          <CategoryCard title="clothe" img={clothe1} />
          <CategoryCard title="laptop" img={laptop} />
          <CategoryCard title="shoes" img={cream} />
          <CategoryCard title="clothe" img={clothe1} />
          <CategoryCard title="shoes" img={cream} />
        </div>
      </div>
    </div>
  );
};
export default CategoryContainer;
