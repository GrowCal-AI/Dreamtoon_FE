import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import DreamInputPage from './pages/DreamInputPage'
import WebtoonViewPage from './pages/WebtoonViewPage'
import AnalyticsPage from './pages/AnalyticsPage'
import LibraryPage from './pages/LibraryPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="input" element={<DreamInputPage />} />
          <Route path="webtoon/:id" element={<WebtoonViewPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="library" element={<LibraryPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
