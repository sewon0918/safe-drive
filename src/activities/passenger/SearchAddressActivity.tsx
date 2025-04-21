import React, { useState } from "react";
import { useFlow } from "../../stackflow";
import { ActivityComponentProps } from "../../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useTripStore } from "../../store/tripStore";
import DaumPostcodeEmbed from "react-daum-postcode";

interface SearchAddressParams {
  searchType: "origin" | "destination";
}

// 카카오 지오코딩 API를 사용한 좌표 변환 함수
const getCoordinates = (address: string) => {
  return new Promise<{ lat: number; lng: number }>((resolve) => {
    // 카카오 지도 API가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error("카카오 지도 API가 로드되지 않았습니다.");
      // 기본 위치(서울시청) 반환
      resolve({ lat: 37.5665, lng: 126.978 });
      return;
    }

    // 지오코더 서비스 생성
    const geocoder = new window.kakao.maps.services.Geocoder();

    // 주소로 좌표 검색
    geocoder.addressSearch(address, (result: any, status: any) => {
      // 정상적으로 검색이 완료됐으면
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = {
          lat: parseFloat(result[0].y), // 위도
          lng: parseFloat(result[0].x), // 경도
        };
        console.log("좌표 변환 결과:", coords);
        resolve(coords);
      } else {
        console.error("주소를 좌표로 변환하는데 실패했습니다:", status);
        // 실패 시 신동아아파트 근처 좌표 반환
        resolve({ lat: 37.522, lng: 126.972 });
      }
    });
  });
};

export const SearchAddressActivity: React.FC<
  ActivityComponentProps<SearchAddressParams>
> = () => {
  const { pop } = useFlow();
  const { setDestination, setDestinationCoords } = useTripStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // 다음 주소 검색 완료 핸들러
  const handleComplete = async (data: any) => {
    setIsProcessing(true);
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    console.log("선택한 주소:", fullAddress);
    console.log("우편번호:", data.zonecode);

    try {
      // 주소에서 정확한 좌표 얻기
      const coords = await getCoordinates(fullAddress);

      // 상태 업데이트
      setDestination(fullAddress);
      setDestinationCoords(coords);

      // URL 직접 변경 후 pop 호출
      pop();
      window.history.pushState({}, "", "/");
    } catch (error) {
      console.error("좌표 변환 중 오류 발생:", error);
      setIsProcessing(false);
    }
  };

  return (
    <AppScreen appBar={{ title: "주소 검색" }}>
      <div className="flex flex-col h-full bg-white">
        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
            <div className="text-gray-700">주소 정보를 처리 중입니다...</div>
          </div>
        )}

        {/* Daum 우편번호 검색 컴포넌트 */}
        <div className="flex-1">
          <DaumPostcodeEmbed
            onComplete={handleComplete}
            style={{ width: "100%", height: "100%" }}
            autoClose={false}
          />
        </div>
      </div>
    </AppScreen>
  );
};
