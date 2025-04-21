import "./App.css";
import { Stack } from "./stackflow";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // 새로고침 감지 및 리다이렉트 처리
    if (
      window.location.pathname !== "/" &&
      window.performance &&
      window.performance.navigation.type === 1
    ) {
      // 새로고침 감지되었고 현재 경로가 루트가 아닌 경우, 루트로 리다이렉트
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="App">
      <Stack />
    </div>
  );
}

export default App;
