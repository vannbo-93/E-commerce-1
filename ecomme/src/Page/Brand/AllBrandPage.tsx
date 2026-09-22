/** @format */
import BrandCard from "./BrandCard.js";
import SubTitle from "../../Components/Utility/SubTitle.js";

import voltex from "../../images/brands/01-voltex.png";
import nuvora from "../../images/brands/02-nuvora.png";
import kiro from "../../images/brands/03-kiro.png";
import aerolux from "../../images/brands/04-aerolux.png";
import zentro from "../../images/brands/05-zentro.png";
import lumiq from "../../images/brands/06-lumiq.png";
import orbyt from "../../images/brands/07-orbyt.png";
import vantra from "../../images/brands/08-vantra.png";
import novexa from "../../images/brands/09-novexa.png";
import ekko from "../../images/brands/10-ekko.png";

// اسم كل علامة تجارية مرتبط بصورتها، ليُستخدم كـ alt وكرابط لصفحة العلامة
const brands = [
  { name: "Voltex", img: voltex },
  { name: "Nuvora", img: nuvora },
  { name: "Kiro", img: kiro },
  { name: "Erolu", img: aerolux },
  { name: "Zentro", img: zentro },
  { name: "Lumiq", img: lumiq },
  { name: "Orbyt", img: orbyt },
  { name: "Vantra", img: vantra },
  { name: "Novexa", img: novexa },
  { name: "Ekko", img: ekko },
];

const AllBrandPage = ({
  title,
  pathText,
}: {
  title: string;
  pathText: string;
}) => {
  return (
    <div className="w-full">
      <SubTitle title={title} pathText={pathText} />
      <div className="my-2 grid grid-cols-2 gap-4 px-4 
       sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 cursor-pointer">
        {brands.map((brand) => (
          <BrandCard key={brand.name} img={brand.img} />
        ))}
      </div>
    </div>
  );
};

export default AllBrandPage;
