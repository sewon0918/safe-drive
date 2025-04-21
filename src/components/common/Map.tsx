import React, { useEffect, useRef } from "react";
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
  zoom = 15,
  className,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);

  // 초기 중심 좌표 (서울)
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

  // 지도 초기화
  useEffect(() => {
    if (!window.kakao || !mapRef.current) return;

    // 유효한 중심 좌표 확보
    const center = isValidCoord(initialCenter) ? initialCenter : defaultCenter;

    const options = {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level: zoom,
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
    kakaoMapRef.current = map;

    return () => {
      kakaoMapRef.current = null;
    };
  }, [initialCenter, zoom]);

  // 마커 추가
  useEffect(() => {
    if (!kakaoMapRef.current || !markers || markers.length === 0) return;

    const map = kakaoMapRef.current;
    const bounds = new window.kakao.maps.LatLngBounds();
    const createdMarkers: any[] = [];

    markers.forEach((markerInfo) => {
      // 마커 위치가 유효한지 확인
      if (!isValidCoord(markerInfo.position)) {
        console.warn("Invalid marker position:", markerInfo);
        return;
      }

      const position = new window.kakao.maps.LatLng(
        markerInfo.position.lat,
        markerInfo.position.lng
      );

      const marker = new window.kakao.maps.Marker({
        position,
        map,
        title: markerInfo.title,
      });

      bounds.extend(position);
      createdMarkers.push(marker);
    });

    // 지도 범위 재설정 (마커가 2개 이상일 때만)
    if (createdMarkers.length >= 2) {
      try {
        map.setBounds(bounds);
      } catch (error) {
        console.error("지도 범위 재설정 중 오류:", error);
      }
    } else if (createdMarkers.length === 1) {
      // 마커가 하나만 있을 경우 해당 위치로 중심 이동
      map.setCenter(createdMarkers[0].getPosition());
    }

    return () => {
      createdMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [markers]);

  // 경로 그리기
  useEffect(() => {
    if (!kakaoMapRef.current || !path) return;

    // path.origin과 path.destination이 유효한지 확인
    if (!isValidCoord(path.origin) || !isValidCoord(path.destination)) {
      console.warn("Invalid path coordinates:", path);
      return;
    }

    const map = kakaoMapRef.current;
    const polyline = new window.kakao.maps.Polyline({
      path: [
        new window.kakao.maps.LatLng(path.origin.lat, path.origin.lng),
        ...(path.waypoints
          ?.filter(isValidCoord)
          .map((wp) => new window.kakao.maps.LatLng(wp.lat, wp.lng)) || []),
        new window.kakao.maps.LatLng(
          path.destination.lat,
          path.destination.lng
        ),
      ],
      strokeWeight: 5,
      strokeColor: "#5B8DDE",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });

    polyline.setMap(map);

    return () => {
      polyline.setMap(null);
    };
  }, [path]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full ${className || ""}`}
      style={{ minHeight: "200px" }}
    >
      {/* 지도를 불러오는 동안 표시할 내용 */}
      <div className="flex items-center justify-center h-full bg-gray-100">
        <span className="text-gray-500">지도를 불러오고 있습니다...</span>
      </div>
    </div>
  );
};

export default Map;
