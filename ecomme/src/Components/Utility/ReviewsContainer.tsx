/** @format */

import ReviewCard from "./CustomerReviews";
import SubTitle from "../../Components/Utility/SubTitle";
import mohamed from "../../images/PhotoPerson/mohamed.jpg";
import ahmed from "../../images/PhotoPerson/ahmed.jpg";
import moha from "../../images/PhotoPerson/moha.jpg";

interface ReviewsContainerProps { title?: string; btntitle?: string; pathText?: string;}
// بيانات تجريبية: استبدلها بأسماء وآراء عملائك الحقيقيين
const reviews = [
  { id: "1", name: "Mohamed", avatar: moha, rating: 5, review:
      "Great quality products and fast delivery. The website is easy to use and has amazing collections!",
  },
  { id: "2", name: "isawi", avatar: mohamed, rating: 5, review:
      "Excellent products with quick delivery. The website is simple to navigate and offers a fantastic selection!",
  },
  { id: "3", name: "mark", avatar: ahmed, rating: 5, review:
      "Amazing product quality and speedy shipping. The website looks great and makes finding products really easy!",
  },
];

const ReviewsContainer = ({ title, btntitle, pathText,}: ReviewsContainerProps) => {
  return (
    <div className="my-4 w-full">
      {title ? (
        <SubTitle title={title} btnTitle={btntitle} pathText={pathText} />
      ) : null}

      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
        {reviews.map((item) => (
          <ReviewCard
            key={item.id}
            name={item.name}
            avatar={item.avatar}
            rating={item.rating}
            review={item.review}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsContainer;
