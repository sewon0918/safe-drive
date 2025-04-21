import React from "react";
import { useFlow } from "../../stackflow";
import { ActivityComponentProps } from "../../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useMatchCallStore } from "../../stores/matchCallStore";
import StarRating from "../../components/common/StarRating";
import StarsDisplay from "../../components/common/StarsDisplay";

// 승객 정보 화면 파라미터 타입
interface PassengerInfoParams {
  passengerId: string;
  passengerName: string;
  passengerGender: "male" | "female";
  passengerRating: number;
  callId: string;
}

export const PassengerInfoActivity: React.FC<
  ActivityComponentProps<PassengerInfoParams>
> = ({ params }) => {
  const { pop } = useFlow();

  // acceptCall 이제 matchCallStore에서 가져옴
  const { acceptCall } = useMatchCallStore();

  // 승객 과거 이용 내역 (Mock 데이터)
  const previousTrips = [
    {
      id: "trip-1",
      date: "2023-10-15",
      origin: "강남역",
      destination: "잠실",
      fare: "₩18,000",
      driverRating: 5,
    },
    {
      id: "trip-2",
      date: "2023-09-22",
      origin: "홍대입구역",
      destination: "강남",
      fare: "₩22,000",
      driverRating: 4,
    },
    {
      id: "trip-3",
      date: "2023-08-10",
      origin: "여의도",
      destination: "성수동",
      fare: "₩25,000",
      driverRating: 5,
    },
  ];

  // 콜 거절 - 콜 리스트로 돌아감
  const handleRejectCall = () => {
    // 거절 처리 후 홈 화면으로 돌아감 (2단계 pop)
    pop(2);
  };

  // 콜 수락
  const handleAcceptCall = () => {
    // 이제 matchCallStore의 acceptCall이 매칭까지 처리
    console.log("acceptCall", params.callId);
    acceptCall(params.callId);
    pop();
  };

  return (
    <AppScreen
      appBar={{
        title: "승객 정보",
      }}
    >
      <div className="flex flex-col h-full bg-gray-50 p-4">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center">
                <h2 className="text-lg font-semibold mr-2">
                  {params.passengerName}
                </h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    params.passengerGender === "female"
                      ? "bg-pink-100 text-pink-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {params.passengerGender === "female" ? "여성" : "남성"}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500 mr-1">평점:</span>

                <StarsDisplay rating={params.passengerRating} />
                <span className="text-sm text-gray-500 ml-1">
                  ({params.passengerRating.toFixed(1)})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 이전 이용 내역 */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-4 overflow-auto">
          <h3 className="text-lg font-semibold mb-3">이전 이용 내역</h3>

          <div className="space-y-3">
            {previousTrips.map((trip) => (
              <div
                key={trip.id}
                className="border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{trip.date}</span>
                  <span>{trip.fare}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {trip.origin} → {trip.destination}
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 mr-1">기사 평가:</span>

                  <StarsDisplay rating={trip.driverRating} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 mt-4">
          <button
            onClick={handleRejectCall}
            className="flex-1 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg"
          >
            콜 거절
          </button>
          <button
            onClick={handleAcceptCall}
            className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-lg"
          >
            콜 수락
          </button>
        </div>
      </div>
    </AppScreen>
  );
};

export default PassengerInfoActivity;
