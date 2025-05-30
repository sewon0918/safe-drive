import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";

// 앱에서 사용할 액티비티(화면) 들을 가져옵니다
import { CallDriverActivity } from "./activities/passenger/call-driver/CallDriverActivity";
// import { WaitingDriverActivity } from "./activities/WaitingDriverActivity"; // 주석 처리
import { SearchAddressActivity } from "./activities/passenger/SearchAddressActivity";
import { DriverInfoActivity } from "./activities/passenger/DriverInfoActivity";
import { TripActivity } from "./activities/passenger/TripActivity"; // TripActivity 추가
import { ShareLocationActivity } from "./activities/passenger/ShareLocationActivity";
import { stackflow } from "@stackflow/react";
import {
  TripCompletedActivity, // 새로 추가한 액티비티
  HomeActivity,
} from "./activities";
import DriverHomeActivity from "./activities/driver/DriverHomeActivity";
import DriverTripActivity from "./activities/driver/DriverTripActivity";
import { PassengerInfoActivity } from "./activities/driver/PassengerInfoActivity";
import DriverTripCompletedActivity from "./activities/driver/DriverTripCompletedActivity";

// Stackflow 초기화
export const { Stack, useFlow } = stackflow({
  transitionDuration: 350, // 화면 전환 애니메이션 시간 (ms)

  // 앱에서 사용할 액티비티(화면) 정의
  activities: {
    Home: HomeActivity,
    CallDriver: CallDriverActivity,
    SearchAddress: SearchAddressActivity,
    DriverInfo: DriverInfoActivity,
    Trip: TripActivity, // TripActivity 추가
    ShareLocation: ShareLocationActivity,
    TripCompleted: TripCompletedActivity, // 새로 추가한 화면
    DriverHome: DriverHomeActivity,
    DriverTrip: DriverTripActivity,
    PassengerInfo: PassengerInfoActivity,
    DriverTripCompleted: DriverTripCompletedActivity,
  },

  // 필요한 플러그인 설정
  plugins: [
    basicRendererPlugin(), // 기본 렌더러 플러그인
    basicUIPlugin({
      theme: "cupertino", // iOS 스타일의 UI 테마 (또는 "material" - Android 스타일)
    }),
    historySyncPlugin({
      routes: {
        Home: "/",
        CallDriver: "/call-driver",
        SearchAddress: "/search-address",
        DriverInfo: "/driver-info",
        Trip: "/trip",
        ShareLocation: "/share-location",
        TripCompleted: "/trip-completed",
        DriverHome: "/driver-home",
        DriverTrip: "/driver-trip",
        PassengerInfo: "/passenger-info",
        DriverTripCompleted: "/driver-trip-completed",
      },
      fallbackActivity: () => "Home",
    }),
  ],
  initialActivity: () => "Home",
});
