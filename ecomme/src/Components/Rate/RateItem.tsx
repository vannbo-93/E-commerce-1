/** @format */

import RatingBadge from "./RatingBadge";

interface RateItemProps {
  name?: string;
  score?: number;
  description?: string;
}

const RateItem = ({
  name = "Mohamed El Aissaoui",
  score = 4.3,
  description = "A suitable product, its price is currently very good, and it has an extra shield",
}: RateItemProps) => {
  return (
    <div>
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <div className="rate-name inline-block">{name}</div>
          <RatingBadge score={score} />
        </div>
        <div className="border-b mx-2">
          <div className="flex pb-2">
            <div className="rate-description inline-block ml-2">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateItem;
