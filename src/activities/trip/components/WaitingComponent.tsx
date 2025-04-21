import React from "react";
import Button from "../../../components/common/Button";

interface DriverInfo {
  id: string;
  name: string;
  gender: "male" | "female";
  rating: number;
  estimatedArrival: string;
}

interface WaitingComponentProps {
  driver: DriverInfo;
  countdown: number | null;
  onViewDriverDetails: () => void;
  renderStars: (rating: number) => JSX.Element[];
}

const WaitingComponent: React.FC<WaitingComponentProps> = ({
  driver,
  countdown,
  onViewDriverDetails,
  renderStars,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-blue-500 -mx-4 -mt-6 p-4 mb-4 text-center text-white">
        <h2 className="font-bold text-xl">기사님과 매칭되었습니다</h2>
        <p className="text-sm text-blue-100">
          {countdown !== null
            ? `${countdown}초 후 운행이 시작됩니다`
            : `도착 예정: ${driver.estimatedArrival}`}
        </p>
      </div>

      {/* 기사님 정보 - 기본 */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
          <img
            src={
              driver.gender === "female"
                ? "/assets/female-driver.png"
                : "/assets/male-driver.png"
            }
            alt={driver.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRINGA0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==";
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-bold text-lg">{driver.name}</h3>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {driver.gender === "female" ? "여성" : "남성"}
            </span>
          </div>
          <div className="flex items-center mt-1">
            {renderStars(driver.rating)}
            <span className="ml-1 text-sm text-gray-600">
              {driver.rating.toFixed(1)}
            </span>
            <Button
              className="ml-2 text-xs text-blue-500 underline"
              onClick={onViewDriverDetails}
              variant="text"
            >
              상세 정보
            </Button>
          </div>
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

      {/* 하단 안내 영역 */}
      <div className="mt-auto">
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-700">
            기사님이 도착하면 자동으로 운행이 시작됩니다
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {countdown === null
              ? "잠시만 기다려 주세요"
              : `${countdown}초 후 시작됩니다`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitingComponent;
