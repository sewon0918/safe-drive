import React, { useEffect, useRef } from "react";
import { Map as KakaoMap, MapMarker, Polyline } from "react-kakao-maps-sdk";

interface MapProps {
  className?: string;
  initialCenter: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
  }>;
  showRoute?: boolean; // 경로 표시 여부
  fitBounds?: boolean; // 모든 마커가 보이도록 자동 조정 여부
}

const Map: React.FC<MapProps> = ({
  className,
  initialCenter,
  zoom = 3,
  markers,
  showRoute = false,
  fitBounds = false,
}) => {
  // 지도 중심점 계산 (출발지와 도착지의 중간 지점)
  let center = initialCenter;

  if (markers && markers.length >= 2 && showRoute) {
    center = {
      lat: (markers[0].position.lat + markers[1].position.lat) / 2,
      lng: (markers[0].position.lng + markers[1].position.lng) / 2,
    };
  }

  // 지도 객체 참조
  const mapRef = useRef<kakao.maps.Map>(null);

  // 모든 마커를 포함하는 영역으로 지도 범위 재설정
  useEffect(() => {
    if (!fitBounds || !mapRef.current || !markers || markers.length < 2) return;

    // 지도 객체 가져오기
    const map = mapRef.current;

    // setTimeout을 사용하여 지도가 완전히 로드된 후에 실행
    setTimeout(() => {
      try {
        // LatLngBounds 객체 생성
        const bounds = new window.kakao.maps.LatLngBounds();

        // 모든 마커의 위치를 bounds에 추가
        markers.forEach((marker) => {
          bounds.extend(
            new window.kakao.maps.LatLng(
              marker.position.lat,
              marker.position.lng
            )
          );
        });

        // 지도 범위 재설정
        map.setBounds(bounds, 100); // 여백 100px 추가
      } catch (error) {
        console.error("지도 범위 재설정 중 오류:", error);
      }
    }, 300);
  }, [markers, fitBounds]);

  return (
    <div className={className}>
      <KakaoMap
        center={center}
        style={{ width: "100%", height: "100%" }}
        level={zoom}
        ref={mapRef}
      >
        {/* 출발지 마커 */}
        {markers && markers.length > 0 && (
          <MapMarker
            position={markers[0].position}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png",
              size: { width: 50, height: 45 },
              options: { offset: { x: 15, y: 43 } },
            }}
          >
            <div style={{ padding: "5px", color: "#000" }}>
              {markers[0].title || "출발지"}
            </div>
          </MapMarker>
        )}

        {/* 도착지 마커 */}
        {markers && markers.length > 1 && (
          <MapMarker
            position={markers[1].position}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png",
              size: { width: 50, height: 45 },
              options: { offset: { x: 15, y: 43 } },
            }}
          >
            <div style={{ padding: "5px", color: "#000" }}>
              {markers[1].title || "도착지"}
            </div>
          </MapMarker>
        )}

        {/* 경로 선 */}
        {markers && markers.length >= 2 && showRoute && (
          <Polyline
            path={[markers[0].position, markers[1].position]}
            strokeWeight={5}
            strokeColor="#2196F3"
            strokeOpacity={0.7}
            strokeStyle="solid"
          />
        )}

        {/* 나머지 마커들 */}
        {markers &&
          markers.length > 2 &&
          markers
            .slice(2)
            .map((marker, index) => (
              <MapMarker
                key={`additional-${index}`}
                position={marker.position}
                title={marker.title}
              />
            ))}
      </KakaoMap>
    </div>
  );
};

export default Map;
