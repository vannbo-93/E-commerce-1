/** @format */

const CategoryCard = ({ title, img }: { title: string; img: string }) => {
  return (
    <div className="group cursor-pointer">
      <div
        className="flex flex-col items-center rounded-xl p-3
          transition-all duration-300 hover:-translate-y-1">
        <img
          src={img}
          alt={title}
          className="h-30 w-30 rounded-xl object-cover shadow-sm
          transition-transform duration-300 group-hover:scale-105"
        />

        <h3
          className="mt-3 text-sm font-semibold transition-colors duration-300
          group-hover:text-sky-500">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;
