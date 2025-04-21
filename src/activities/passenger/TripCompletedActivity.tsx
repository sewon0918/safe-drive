import React, { useState } from "react";
import { useFlow } from "../../stackflow";
import { ActivityComponentProps } from "../../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import StarRating from "../../components/common/StarRating";

// 승객용 운행 완료 화면 파라미터 타입
interface TripCompletedParams {
  driverId: string;
  driverName: string;
  fare: string;
}

export const TripCompletedActivity: React.FC<
  ActivityComponentProps<TripCompletedParams>
> = ({ params }) => {
  const { pop } = useFlow();
  const [rating, setRating] = useState<number>(0);

  // 기사 평가 처리
  const handleRating = (value: number) => {
    setRating(value);
  };

  // 완료 후 홈 화면으로 이동
  const handleGoHome = () => {
    pop(2); // 2단계 뒤로 이동 (운행 화면 건너뛰고 홈으로)
  };

  return (
    <AppScreen appBar={{ title: "운행 완료" }}>
      <div className="flex flex-col h-full bg-white">
        {/* 요약 정보 */}
        <div className="bg-blue-500 px-6 pt-8 pb-6 text-white">
          <h2 className="text-2xl font-bold mb-1">목적지에 도착했습니다</h2>
          <p className="text-blue-100 mb-6">
            안전하게 운행해 주셔서 감사합니다.
          </p>

          <div className="bg-white rounded-lg shadow-md p-4 text-black mb-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-500 text-sm">운행 요금</div>
              <div className="text-xl font-bold">{params.fare}</div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
              <div className="text-gray-500 text-sm">결제 수단</div>
              <div className="text-lg font-semibold text-gray-800">
                신한카드 (1234)
              </div>
            </div>
          </div>
        </div>

        {/* 기사 평가 */}
        <div className="flex-1 px-6 py-6">
          <h3 className="text-lg font-semibold mb-4">
            {params.driverName} 기사님 평가하기
          </h3>
          <p className="text-gray-500 mb-4">기사님의 서비스는 어떠셨나요?</p>

          <div className="flex justify-center mb-8 px-4">
            <StarRating
              rating={rating}
              onRating={handleRating}
              size="lg"
              spacing={4}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm text-gray-600 mb-2"
            >
              코멘트 (선택사항)
            </label>
            <textarea
              id="comment"
              className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none"
              placeholder="기사님에 대한 피드백을 남겨주세요..."
            ></textarea>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="px-6 pb-8 space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full py-4 bg-blue-500 text-white font-medium rounded-lg"
          >
            평가 완료
          </button>
        </div>
      </div>
    </AppScreen>
  );
};

export default TripCompletedActivity;
