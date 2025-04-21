interface KakaoMapAPI {
  maps: {
    Map: any;
    LatLng: any;
    Marker: any;
    MarkerImage: any;
    Size: any;
    InfoWindow: any;
    CustomOverlay: any;
    ZoomControl: any;
    MapTypeControl: any;
    ControlPosition: any;
    event: any;
    load: (callback: () => void) => void;
  };
}

declare global {
  interface Window {
    kakao: KakaoMapAPI;
  }
}

export {};
