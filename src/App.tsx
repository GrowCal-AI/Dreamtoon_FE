import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import DreamInputPage from './pages/DreamInputPage'
import DreamChatPage from './pages/DreamChatPage'
import WebtoonViewPage from './pages/WebtoonViewPage'
import AnalyticsPage from './pages/AnalyticsPage'
import LibraryPage from './pages/LibraryPage'
import PricingPage from './pages/PricingPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import LoginPage from './pages/LoginPage'
import OAuthCallbackPage from './pages/OAuthCallbackPage'
import { useAuthStore } from './store/useAuthStore'

function App() {
  const { isLoggedIn, user, fetchUser } = useAuthStore()

  // 앱 로드 시 토큰이 있으면 사용자 정보 + 구독 정보 조회
  useEffect(() => {
    if (isLoggedIn && !user) {
      fetchUser()
    }
  }, [isLoggedIn, user, fetchUser])

  return (
    <Router>
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
    </Router>
  )
}

export default App
