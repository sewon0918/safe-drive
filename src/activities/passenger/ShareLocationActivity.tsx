import React from "react";
import { useFlow } from "../../stackflow";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import Map from "../../components/common/Map";
import Button from "../../components/common/Button";
import { ActivityComponentProps } from "../../types/activities";

// URL 파라미터 타입 정의
interface ShareLocationParams {
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  currentLat: number;
  currentLng: number;
  driverName: string;
  estimatedTime: number;
  estimatedFare: string;
}

export const ShareLocationActivity: React.FC<
  ActivityComponentProps<ShareLocationParams>
> = ({ params }) => {
  const { pop } = useFlow();

  // 파라미터에서 위치 정보 추출
  const originCoords = {
    lat: parseFloat(params.originLat.toString()),
    lng: parseFloat(params.originLng.toString()),
  };

  const destinationCoords = {
    lat: parseFloat(params.destinationLat.toString()),
    lng: parseFloat(params.destinationLng.toString()),
  };

  const currentCoords = {
    lat: parseFloat(params.currentLat.toString()),
    lng: parseFloat(params.currentLng.toString()),
  };

  // 리마인더: 운행 정보
  const driverName = params.driverName || "기사님";
  const estimatedTime = params.estimatedTime || 0;
  const estimatedFare = params.estimatedFare || "₩0";

  return (
    <AppScreen appBar={{ title: "실시간 위치 정보" }}>
      <div className="flex flex-col h-full">
        {/* 지도 영역 */}
        <div className="relative h-3/5">
          <Map
            initialCenter={currentCoords}
            markers={[
              {
                position: originCoords,
                title: "출발지",
                icon: "origin",
              },
              {
                position: destinationCoords,
                title: "목적지",
                icon: "destination",
              },
              {
                position: currentCoords,
                title: `현재 위치`,
                icon: "driver",
              },
            ]}
            path={{
              origin: originCoords,
              destination: destinationCoords,
            }}
          />
        </div>

        {/* 정보 영역 */}
        <div className="h-2/5 bg-white rounded-t-3xl shadow-lg px-4 py-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="font-bold text-xl text-center mb-2">
              {driverName}과 함께 이동 중
            </h2>
            <p className="text-sm text-gray-600 text-center">
              안전하게 이동 중이니 안심하세요!
            </p>
          </div>

          {/* 운행 정보 */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">예상 도착 시간</span>
              <span className="font-medium">약 {estimatedTime}분 후</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">예상 요금</span>
              <span className="font-bold">{estimatedFare}</span>
            </div>
          </div>

          {/* 현재 위치 정보 */}
          <div className="p-2 border-t border-gray-200 mt-4">
            <p className="text-xs text-gray-500 text-center">
              최종 업데이트: {new Date().toLocaleString()}
            </p>
          </div>

          {/* 닫기 버튼 */}
          <div className="mt-4">
            <Button variant="primary" size="lg" fullWidth onClick={pop}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </AppScreen>
  );
};
