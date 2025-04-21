import React from "react";
import StarsDisplay from "./StarsDisplay";

interface ReviewItemProps {
  reviewer: string;
  rating: number;
  date: string;
  comment?: string;
}

/**
 * 기사님 프로필 정보를 표시하는 재사용 가능한 카드 컴포넌트
 */
const ReviewItem: React.FC<ReviewItemProps> = ({
  reviewer,
  rating,
  date,
  comment,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg text-left">
      <div className="flex  items-start mb-2">
        <div>
          <div className="font-medium">{reviewer}</div>
          <div className="flex items-center mt-1">
            <StarsDisplay rating={rating} />
            <span className="text-xs text-gray-500 ml-2">{date}</span>
          </div>
        </div>
      </div>
      {comment && <p className="text-gray-600 text-sm">{comment}</p>}
    </div>
  );
};

export default ReviewItem;
