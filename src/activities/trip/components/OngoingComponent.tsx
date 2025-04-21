import React from "react";
import Button from "../../../components/common/Button";

interface DriverInfo {
  id: string;
  name: string;
  gender: "male" | "female";
  rating: number;
}

interface OngoingComponentProps {
  driver: DriverInfo;
  distance: string;
  duration: number;
  estimatedFare: string;
  renderStars: (rating: number) => React.ReactElement[];
  onEmergencyContact: () => void;
  onEmergencyReport: () => void;
}

const OngoingComponent: React.FC<OngoingComponentProps> = ({
  driver,
  distance,
  duration,
  estimatedFare,
  renderStars,
  onEmergencyContact,
  onEmergencyReport,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-green-500 -mx-4 -mt-6 p-4 mb-4 text-center text-white">
        <h2 className="font-bold text-xl">운행이 시작되었습니다</h2>
        <p className="text-sm text-green-100">안전한 여행 되세요!</p>
      </div>

      {/* 운행 정보 표시 */}
      <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-lg">
        <div>
          <p className="font-medium">예상 도착 시간</p>
          <p className="text-sm text-gray-600">약 {duration}분 후</p>
        </div>
        <div className="text-right">
          <p className="font-medium">예상 요금</p>
          <p className="text-xl font-bold text-black">{estimatedFare}</p>
        </div>
      </div>

      {/* 기사 정보 요약 */}
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
            <h3 className="font-bold text-lg">{driver.name} 기사님</h3>
          </div>
          <div className="flex items-center mt-1">
            {renderStars(driver.rating)}
            <span className="ml-1 text-sm text-gray-600">
              {driver.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* 이동 정보 */}
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">이동 거리</span>
          <span className="text-sm font-medium">{distance}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">예상 소요 시간</span>
          <span className="text-sm font-medium">{duration}분</span>
        </div>
      </div>

      {/* 비상 연락처 및 안전 기능 */}
      <div className="mt-auto">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          className="mb-3"
          onClick={onEmergencyContact}
        >
          비상 연락처
        </Button>
        <Button
          variant="danger"
          size="lg"
          fullWidth
          onClick={onEmergencyReport}
        >
          긴급 상황 신고
        </Button>
      </div>
    </div>
  );
};

export default OngoingComponent;
