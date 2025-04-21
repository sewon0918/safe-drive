import React from "react";

interface DriverMatchCardProps {
  driverName: string;
  driverGender: "male" | "female";
  driverRating: number;
  estimatedArrival: string;
  onAccept: () => void;
  onDecline: () => void;
}

const DriverMatchCard: React.FC<DriverMatchCardProps> = ({
  driverName,
  driverGender,
  driverRating,
  estimatedArrival,
  onAccept,
  onDecline,
}) => {
  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`star-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half-star"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-star-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* 헤더 */}
        <div className="bg-blue-500 p-4 text-center text-white">
          <h2 className="font-bold text-xl">기사님이 배정되었습니다</h2>
          <p className="text-sm text-blue-100">도착 예정: {estimatedArrival}</p>
        </div>

        {/* 기사님 정보 */}
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mr-4 flex-shrink-0">
              {/* 기사님 사진 */}
              <img
                src={
                  driverGender === "female"
                    ? "/assets/female-driver.png"
                    : "/assets/male-driver.png"
                }
                alt="기사님 사진"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 이미지 로드 실패 시 기본 아이콘 표시
                  e.currentTarget.src =
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRINGE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==";
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-bold text-lg">{driverName}</h3>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {driverGender === "female" ? "여성" : "남성"}
                </span>
              </div>
              <div className="flex items-center mt-1">
                {renderStars(driverRating)}
                <span className="ml-1 text-sm text-gray-600">
                  {driverRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                안전 운전을 위해 최선을 다하겠습니다.
              </p>
            </div>
          </div>

          {/* 기사님 정보 - 추가 정보 */}
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">이동 수단</span>
              <span className="text-sm font-medium">전동 킥보드</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">현재 위치</span>
              <span className="text-sm font-medium">약 1.2km 떨어짐</span>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex space-x-2">
            <button
              onClick={onDecline}
              className="flex-1 py-3 border border-red-500 text-red-500 font-medium rounded-lg"
            >
              거절하기
            </button>
            <button
              onClick={onAccept}
              className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-lg"
            >
              수락하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverMatchCard;
