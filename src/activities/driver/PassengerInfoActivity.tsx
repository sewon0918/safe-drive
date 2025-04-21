import React from "react";
import { useFlow } from "../../stackflow";
import { ActivityComponentProps } from "../../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useMatchCallStore } from "../../stores/matchCallStore";
import ReviewItem from "../../components/common/ReviewItem";
import PassengerProfileCard from "./components/PassengerProfileCard";
import Button from "../../components/common/Button";

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
  const { acceptCall, matchedCallId } = useMatchCallStore();

  // 승객 과거 이용 내역 (Mock 데이터)
  const previousTrips = [
    {
      id: "trip-1",
      reviewer: "홍길동",
      rating: 5,
      date: "2023-10-15",
      comment: "매너가 좋으십니다.",
    },
    {
      id: "trip-2",
      reviewer: "이순신",
      rating: 4,
      date: "2023-09-22",
    },
    {
      id: "trip-3",
      reviewer: "김철수",
      rating: 3,
      date: "2023-08-10",
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
        <PassengerProfileCard
          name={params.passengerName}
          gender={params.passengerGender}
          rating={params.passengerRating}
        />

        {/* 이전 이용 내역 */}
        <h3 className="text-sm font-semibold my-3">이전 이용 내역</h3>

        <div className="flex-1 bg-white rounded-lg  p-4 overflow-auto">
          <div className="space-y-3">
            {previousTrips.map(({ id, reviewer, rating, date, comment }) => (
              <div
                key={id}
                className="border-b border-gray-100 pb-3 last:border-0"
              >
                <ReviewItem
                  reviewer={`${reviewer} 기사님`}
                  rating={rating}
                  date={date}
                  comment={comment}
                />
              </div>
            ))}
          </div>
        </div>

        {!matchedCallId && (
          <div className="flex space-x-3 mt-4">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              className="flex-1"
              onClick={handleRejectCall}
            >
              거절하기
            </Button>

            <Button
              fullWidth
              size="lg"
              className="flex-1"
              onClick={handleAcceptCall}
            >
              수락하기
            </Button>
          </div>
        )}
      </div>
    </AppScreen>
  );
};

export default PassengerInfoActivity;
