/** @format */

const CategoryCard = ({ title, img }: { title: string; img: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <img
        src={img}
        alt={title}
        className="w-20 h-20 rounded-lg object-cover cursor-pointer "
      />
      <h3
        className="text-sm font-medium bg-linear-to-r from-pink-200 to-violet-400
       bg-clip-text text-6xl text-transparent text-shadow-lg">
        {title}
      </h3>
    </div>
  );
};

export default CategoryCard;
