import React, { useState, useEffect } from "react";
import { useFlow } from "../../stackflow";
import { ActivityComponentProps } from "../../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useMatchCallStore } from "../../stores/matchCallStore";
import StarRating from "../../components/common/StarRating";
import Button from "../../components/common/Button";

// 기사용 운행 완료 화면 파라미터 타입
interface DriverTripCompletedParams {
  callId: string;
  fare: string;
}

export const DriverTripCompletedActivity: React.FC<
  ActivityComponentProps<DriverTripCompletedParams>
> = () => {
  const { pop } = useFlow();
  const [rating, setRating] = useState<number>(0);
  const resetMatch = useMatchCallStore((state) => state.resetMatch);

  // 컴포넌트 마운트 시 매칭 정보 리셋
  useEffect(() => {
    resetMatch();
  }, [resetMatch]);

  // 승객 평가 처리
  const handleRating = (value: number) => {
    setRating(value);
  };

  // 완료 후 다음 콜 찾기
  const handleNextCall = () => {
    pop(2);
  };

  return (
    <AppScreen appBar={{ title: "운행 완료" }}>
      <div className="flex flex-col h-full bg-white">
        {/* 요약 정보 */}
        <div className="bg-blue-500 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold ">운행이 완료되었습니다</h2>
        </div>

        {/* 승객 평가 */}
        <div className="flex-1 px-6 py-6">
          <h3 className="text-lg font-semibold mb-4">승객 평가하기</h3>
          <p className="text-gray-500 mb-4">승객에 대한 평가를 해주세요.</p>

          <div className="flex justify-center mb-8 px-4">
            <StarRating rating={rating} onRating={handleRating} spacing={4} />
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
              placeholder="승객에 대한 코멘트를 남겨주세요..."
            ></textarea>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="px-6 pb-8 space-y-3">
          <Button size="lg" fullWidth onClick={handleNextCall}>
            다음 콜 찾기
          </Button>
        </div>
      </div>
    </AppScreen>
  );
};

export default DriverTripCompletedActivity;
