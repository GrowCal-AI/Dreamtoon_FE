import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/useAuthStore";

// Lazy-loaded pages (code splitting)
const DreamInputPage = lazy(() => import("./pages/DreamInputPage"));
const DreamChatPage = lazy(() => import("./pages/DreamChatPage"));
const WebtoonViewPage = lazy(() => import("./pages/WebtoonViewPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OAuthCallbackPage = lazy(() => import("./pages/OAuthCallbackPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0F0C29]">
    <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
  </div>
);

function App() {
  const { isLoggedIn, user, fetchUser } = useAuthStore();

  // 앱 로드 시 토큰이 있으면 사용자 정보 + 구독 정보 조회
  useEffect(() => {
    if (isLoggedIn && !user) {
      fetchUser();
    }
  }, [isLoggedIn, user, fetchUser]);

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentSuccessPage />} />
          {/* 꿈 대화 채팅 페이지 (레이아웃 없이 풀스크린) */}
          <Route path="/dream-chat" element={<DreamChatPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="input" element={<DreamInputPage />} />
            <Route path="chat" element={<DreamInputPage />} />
            <Route path="webtoon/:id" element={<WebtoonViewPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="pricing" element={<PricingPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
