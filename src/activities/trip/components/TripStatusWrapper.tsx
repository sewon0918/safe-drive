import React, { ReactNode } from "react";

interface TripStatusWrapperProps {
  status: "matching" | "matchedPending" | "waiting" | "ongoing";
  children: ReactNode;
}

const TripStatusWrapper: React.FC<TripStatusWrapperProps> = ({
  status,
  children,
}) => {
  // 상태에 따른 스타일과 텍스트 설정
  const getStatusConfig = () => {
    switch (status) {
      case "matching":
        return {
          bgColor: "bg-blue-500",
          textColor: "text-white",
          title: "기사님 매칭 중",
          description: "근처의 기사님을 찾고 있습니다",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ),
        };
      case "matchedPending":
        return {
          bgColor: "bg-yellow-500",
          textColor: "text-white",
          title: "기사님이 매칭되었습니다",
          description: "기사님의 응답을 기다리고 있습니다",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case "waiting":
        return {
          bgColor: "bg-indigo-500",
          textColor: "text-white",
          title: "기사님 도착 대기 중",
          description: "기사님이 곧 도착합니다",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
          ),
        };
      case "ongoing":
        return {
          bgColor: "bg-green-500",
          textColor: "text-white",
          title: "운행이 시작되었습니다",
          description: "안전한 여행 되세요!",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          ),
        };
      default:
        return {
          bgColor: "bg-gray-500",
          textColor: "text-white",
          title: "여행 진행 중",
          description: "",
          icon: null,
        };
    }
  };

  const { bgColor, textColor, title, description, icon } = getStatusConfig();

  return (
    <div className="flex flex-col h-fit">
      {/* 상태 표시 영역 */}
      <div className={`${bgColor} bg-white p-4 rounded-t-lg mb-4`}>
        {status}
        {/* <div className="flex items-center justify-center">
          {icon}
          <h2 className={`${textColor} font-bold text-lg`}>{title}</h2>
        </div>
        {description && (
          <p className={`${textColor} text-sm opacity-90 text-center mt-1`}>
            {description}
          </p>
        )} */}
      </div>

      {/* 컴포넌트 내용 영역 */}
      <div className="flex-1 overflow-y-auto px-1">{children}</div>
    </div>
  );
};

export default TripStatusWrapper;
