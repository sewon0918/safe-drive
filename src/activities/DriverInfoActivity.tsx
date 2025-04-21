import React from "react";
import { useFlow } from "../stackflow";
import { ActivityComponentProps } from "../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import Button from "../components/common/Button";
import { useMatchingStore } from "../store/matchingStore";
import DriverProfileCard from "../components/common/DriverProfileCard";

interface DriverInfoParams {
  driverId: string;
  driverName: string;
  driverRating: number;
  driverGender: "male" | "female";
  estimatedArrival: string;
}

// 리뷰 데이터 (실제로는 API에서 가져와야 함)
const MOCK_REVIEWS = [
  {
    id: "1",
    rating: 5,
    comment: "정말 친절하게 운전해주셨어요. 안전 운전은 물론 좋은 대화까지!",
    date: "2023-08-15",
    reviewer: "승객1",
  },
  {
    id: "2",
    rating: 4,
    comment: "안전하게 운전해주셔서 좋았습니다.",
    date: "2023-07-22",
    reviewer: "승객2",
  },
  {
    id: "3",
    rating: 5,
    comment:
      "늦은 시간에도 안전하게 데려다주셔서 감사합니다. 다음에도 또 부탁드려요.",
    date: "2023-06-30",
    reviewer: "승객3",
  },
];

export const DriverInfoActivity: React.FC<
  ActivityComponentProps<DriverInfoParams>
> = ({ params }) => {
  const { pop } = useFlow();
  const { matchedDriver, setMatchedDriver, resetMatching } = useMatchingStore();

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }

    return stars;
  };

  // 매칭 수락 함수
  const handleAccept = () => {
    if (matchedDriver) {
      // 매칭 수락 상태로 업데이트
      setMatchedDriver({
        ...matchedDriver,
        accepted: true,
      });
      pop();
    }
  };

  // 매칭 거절 함수
  const handleReject = () => {
    // 매칭 상태 초기화
    resetMatching();

    // 이전 화면으로 이동
    window.history.pushState({}, "", "/trip");
    pop();
  };

  // 추가 정보 컴포넌트
  const additionalInfo = (
    <p className="text-sm text-gray-500">
      안전 운전을 위해 최선을 다하겠습니다.
    </p>
  );

  return (
    <AppScreen appBar={{ title: "기사님 정보" }}>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-4">
          {/* 기사님 프로필 카드 */}
          <DriverProfileCard
            name={params.driverName}
            gender={params.driverGender}
            rating={params.driverRating}
            renderStars={renderStars}
            additionalInfo={additionalInfo}
            imageSize="lg"
          />

          {/* 기사님 정보 - 추가 정보 */}
          <div className="bg-white p-3 rounded-lg shadow-sm mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">이동 수단</span>
              <span className="text-sm font-medium">전동 킥보드</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">현재 위치</span>
              <span className="text-sm font-medium">약 1.2km 떨어짐</span>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 (스크롤 가능) */}
        <div className="flex-1 overflow-auto p-4">
          <h3 className="font-medium text-gray-700 mb-3">이전 승객 리뷰</h3>

          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white p-4 rounded-lg shadow-sm mb-3 text-left"
            >
              <div className="flex  items-start mb-2">
                <div>
                  <div className="font-medium">{review.reviewer}</div>
                  <div className="flex items-center mt-1">
                    {renderStars(review.rating)}
                    <span className="text-xs text-gray-500 ml-2">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* 하단 버튼 영역 (수락/거절) */}
        <div className="p-4 bg-white shadow-top">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 text-red-500 border-red-500"
              onClick={handleReject}
            >
              거절하기
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleAccept}
            >
              수락하기
            </Button>
          </div>
        </div>
      </div>
    </AppScreen>
  );
};
