import React, { useEffect } from "react";
import { useFlow } from "../../stackflow";
import { ActivityComponentProps } from "../../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import CallListItem from "./components/CallListItem";
import { useMatchCallStore } from "../../stores/matchCallStore";

export const DriverHomeActivity: React.FC<ActivityComponentProps> = () => {
  const { push } = useFlow();
  const { calls, loading, fetchCalls, getCallById } = useMatchCallStore();

  // 콜 클릭 처리 함수 수정 - 이제 ID만 전달
  const handleCallClick = (callId: string) => {
    // 콜 정보가 있는지 확인
    const callInfo = getCallById(callId);
    if (!callInfo) return; // 콜 정보가 없으면 무시

    // 통합된 DriverTrip으로 이동 (ID만 전달)
    push("DriverTrip", {
      callId: callId,
    });
  };

  // 콜 리스트 페치
  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  return (
    <AppScreen appBar={{ title: "대기 중인 콜" }}>
      <div className="flex flex-col h-full bg-gray-50">
        {/* 콜 리스트 */}
        <div className="flex-1 overflow-auto p-4">
          <h3 className="text-lg font-semibold mb-3">주변 대기 콜</h3>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : calls.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              대기 중인 콜이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {calls.map((call) => (
                <CallListItem
                  key={call.id}
                  call={call}
                  onClick={() => handleCallClick(call.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppScreen>
  );
};

export default DriverHomeActivity;
