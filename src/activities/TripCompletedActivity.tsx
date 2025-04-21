import React, { useState } from "react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentProps } from "../types/activities";
import { useFlow } from "../stackflow";
import Button from "../components/common/Button";
import DriverProfileCard from "../components/common/DriverProfileCard";

interface TripCompletedParams {
  driverId: string;
  driverName: string;
  driverGender: "male" | "female";
  driverRating: number;
  tripDistance: string;
  tripDuration: number;
  tripFare: string;
  pickup: string;
  dropoff: string;
}

export const TripCompletedActivity: React.FC<
  ActivityComponentProps<TripCompletedParams>
> = ({ params }) => {
  const { replace, pop } = useFlow();
  const [rating, setRating] = useState<number>(0);
  const [safetyRating, setSafetyRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  // 평점 선택 처리
  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating);
  };

  // 여성 안심도 평점 선택 처리
  const handleSafetyRatingSelect = (selectedRating: number) => {
    setSafetyRating(selectedRating);
  };

  // 리뷰 제출 처리
  const handleSubmitReview = () => {
    setIsSubmitting(true);

    // 실제 구현에서는 API 호출을 통해 평점과 리뷰를 저장
    setTimeout(() => {
      setIsSubmitting(false);
      pop(2);
    }, 1000);
  };

  // 리뷰 작성 건너뛰기
  const handleSkipReview = () => {
    pop(2);
  };

  // 별점 입력 UI 컴포넌트
  const RatingSelector = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (rating: number) => void;
    label?: string;
  }) => {
    return (
      <div className="w-full mb-4 px-2">
        {label && (
          <p className="text-sm text-gray-600 mb-2 text-center">{label}</p>
        )}
        <div className="w-full flex justify-center items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onChange(star)}
              className="flex-shrink-0 p-1"
              aria-label={`${star}점`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-7 w-7 ${
                  star <= value ? "text-yellow-400" : "text-gray-300"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AppScreen
      appBar={{ title: "운행 완료", backButton: { render: () => null } }}
    >
      <div className="flex flex-col h-full bg-gray-50">
        {/* 운행 완료 헤더 */}
        <div className="bg-green-500 p-6 text-white text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-xl font-bold">운행이 완료되었습니다</h2>
          <p className="text-sm text-green-100">안전하게 도착하셨습니다</p>
        </div>

        {/* 운행 정보 및 리뷰 작성 영역 */}
        <div className="flex-1 overflow-auto p-4">
          {/* 운행 요약 정보 */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h3 className="font-medium text-gray-700 mb-3">운행 정보</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-2 rounded-md">
                <div className="text-xs text-gray-500">운행 시간</div>
                <div className="font-medium">{params.tripDuration}분</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <div className="text-xs text-gray-500">이동 거리</div>
                <div className="font-medium">{params.tripDistance}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <div className="text-xs text-gray-500">요금</div>
                <div className="font-medium">{params.tripFare}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <div className="text-xs text-gray-500">결제 수단</div>
                <div className="font-medium">카드 결제 완료</div>
              </div>
            </div>

            <div className="mt-3 text-sm">
              <div className="flex items-start mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 mr-1 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <span className="text-gray-500">출발:</span> {params.pickup}
                </div>
              </div>
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 mr-1 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <span className="text-gray-500">도착:</span> {params.dropoff}
                </div>
              </div>
            </div>
          </div>

          {/* 기사 프로필 */}
          <div className="mb-4">
            <DriverProfileCard
              name={params.driverName}
              gender={params.driverGender}
              rating={params.driverRating}
              renderStars={renderStars}
            />
          </div>

          {/* 평점 및 리뷰 작성 영역 */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2 text-center">
              기사님에 대한 평가를 남겨주세요
            </h3>
            <p className="text-sm text-gray-500 text-center mb-2">
              서비스 개선에 큰 도움이 됩니다.
            </p>

            {/* 일반 서비스 별점 선택기 */}
            <RatingSelector
              value={rating}
              onChange={handleRatingSelect}
              label="기사님의 서비스는 어떠셨나요?"
            />

            {/* 여성 안심도 별점 선택기 */}
            <div className="mt-4 pb-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2 text-center">
                여성 안심도 평가
              </h4>
              <p className="text-sm text-gray-500 text-center mb-2">
                기사님의 서비스가 얼마나 안전하고 편안했는지 평가해주세요.
              </p>
              <RatingSelector
                value={safetyRating}
                onChange={handleSafetyRatingSelect}
              />

              <div className="flex justify-between text-xs text-gray-500 px-2 mt-1">
                <span>매우 불안함</span>
                <span>보통</span>
                <span>매우 안전함</span>
              </div>
            </div>

            {/* 리뷰 텍스트 입력 */}
            <div className="mt-4">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="기사님의 서비스는 어땠나요? (선택사항)"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="p-4 bg-white shadow-top">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleSkipReview}
            >
              건너뛰기
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleSubmitReview}
              disabled={(rating === 0 && safetyRating === 0) || isSubmitting}
            >
              {isSubmitting ? "제출 중..." : "리뷰 제출"}
            </Button>
          </div>
        </div>
      </div>
    </AppScreen>
  );
};
