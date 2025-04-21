import React, { useState, useEffect, useRef } from "react";
import { Map as KakaoMap, MapMarker, Polyline } from "react-kakao-maps-sdk";

interface MapProps {
  initialCenter: { lat: number; lng: number };
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    icon?: string;
  }>;
  path?: {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    waypoints?: Array<{ lat: number; lng: number }>;
  };
  zoom?: number;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  initialCenter,
  markers = [],
  path,
  zoom = 7,
  className,
}) => {
  const mapRef = useRef<kakao.maps.Map>(null);

  const [bounds, setBounds] = useState<
    | { sw: { lat: number; lng: number }; ne: { lat: number; lng: number } }
    | undefined
  >(undefined);

  // 기본 중심 좌표 (서울)
  const defaultCenter = { lat: 37.5665, lng: 126.978 };

  // 유효한 좌표인지 확인하는 함수
  const isValidCoord = (coord: any): boolean => {
    return (
      coord &&
      typeof coord === "object" &&
      typeof coord.lat === "number" &&
      typeof coord.lng === "number" &&
      !isNaN(coord.lat) &&
      !isNaN(coord.lng)
    );
  };

  // 경로 좌표 생성
  const pathCoordinates = React.useMemo(() => {
    if (!path) return [];

    // 유효성 검사
    if (!isValidCoord(path.origin) || !isValidCoord(path.destination)) {
      return [];
    }

    // 경로 좌표 생성
    const coordinates = [
      { lat: path.origin.lat, lng: path.origin.lng },
      ...(path.waypoints?.filter(isValidCoord) || []),
      { lat: path.destination.lat, lng: path.destination.lng },
    ];

    return coordinates;
  }, [path]);

  // 유효한 마커만 필터링
  const validMarkers = React.useMemo(() => {
    return markers.filter((marker) => isValidCoord(marker.position));
  }, [markers]);

  // 지도 bounds 계산
  useEffect(() => {
    // 마커나 경로가 없으면 bounds 계산 안함
    if ((validMarkers.length === 0 && !path) || !path) {
      setBounds(undefined);
      return;
    }

    // 모든 좌표 수집
    let allCoordinates: { lat: number; lng: number }[] = [];

    // 마커 좌표 추가
    validMarkers.forEach((marker) => {
      allCoordinates.push(marker.position);
    });

    // 경로 좌표 추가
    if (path && isValidCoord(path.origin) && isValidCoord(path.destination)) {
      allCoordinates.push(path.origin);
      allCoordinates.push(path.destination);

      // 경유지 추가
      if (path.waypoints) {
        path.waypoints.filter(isValidCoord).forEach((waypoint) => {
          allCoordinates.push(waypoint);
        });
      }
    }

    // 좌표가 2개 미만이면 bounds 계산 안함
    if (allCoordinates.length < 2) {
      setBounds(undefined);
      return;
    }

    // 최대/최소 위도/경도 계산
    let minLat = allCoordinates[0].lat;
    let maxLat = allCoordinates[0].lat;
    let minLng = allCoordinates[0].lng;
    let maxLng = allCoordinates[0].lng;

    allCoordinates.forEach((coord) => {
      minLat = Math.min(minLat, coord.lat);
      maxLat = Math.max(maxLat, coord.lat);
      minLng = Math.min(minLng, coord.lng);
      maxLng = Math.max(maxLng, coord.lng);
    });

    // 패딩 추가 (화면에 적절히 표시하기 위함)
    const latPadding = (maxLat - minLat) * 0.1;
    const lngPadding = (maxLng - minLng) * 0.1;

    setBounds({
      sw: { lat: minLat - latPadding, lng: minLng - lngPadding },
      ne: { lat: maxLat + latPadding, lng: maxLng + lngPadding },
    });
  }, [validMarkers, path]);

  // 지도 bounds 설정 - 지도가 로드된 후 실행
  useEffect(() => {
    if (!mapRef.current || !bounds) return;

    // kakao 지도 API를 사용하여 bounds 설정
    try {
      const map = mapRef.current;
      const kakaoBounds = new kakao.maps.LatLngBounds(
        new kakao.maps.LatLng(bounds.sw.lat, bounds.sw.lng),
        new kakao.maps.LatLng(bounds.ne.lat, bounds.ne.lng)
      );

      map.setBounds(kakaoBounds);
    } catch (error) {
      console.error("지도 범위 설정 오류:", error);
    }
  }, [bounds, mapRef.current]);

  // 유효한 중심 좌표 가져오기
  const center = isValidCoord(initialCenter) ? initialCenter : defaultCenter;

  return (
    <div className={`w-full h-full ${className || ""}`}>
      <KakaoMap
        center={{ lat: center.lat, lng: center.lng }}
        level={zoom}
        style={{ width: "100%", height: "100%", minHeight: "200px" }}
        ref={mapRef}
        onCreate={(map) => {
          // 지도 생성 시 ref에 지도 인스턴스 저장
          mapRef.current = map;
        }}
      >
        {/* 마커 표시 */}
        {validMarkers.map((marker, index) => (
          <MapMarker
            key={`marker-${index}`}
            position={{ lat: marker.position.lat, lng: marker.position.lng }}
            image={
              marker.icon
                ? {
                    src: `/assets/marker-${marker.icon}.png`,
                    size: { width: 35, height: 45 },
                  }
                : undefined
            }
          >
            {marker.title && (
              <div style={{ padding: "5px", color: "#000" }}>
                {marker.title}
              </div>
            )}
          </MapMarker>
        ))}

        {/* 경로 표시 */}
        {pathCoordinates.length >= 2 && (
          <Polyline
            path={pathCoordinates}
            strokeWeight={5}
            strokeColor="#5B8DDE"
            strokeOpacity={0.7}
            strokeStyle="solid"
          />
        )}
      </KakaoMap>
    </div>
  );
};

export default Map;
