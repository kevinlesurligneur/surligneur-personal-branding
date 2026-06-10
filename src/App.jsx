import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfileDetailPage from './pages/ProfileDetailPage'
import QuizPage from './pages/QuizPage'
import LeadFormPage from './pages/LeadFormPage'
import ResultsPage from './pages/ResultsPage'
import AdminPage from './pages/AdminPage'
import LegalPage from './pages/LegalPage'
import { ScrollToTop } from './components/common/ScrollToTop'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profil/:id" element={<ProfileDetailPage />} />
        <Route path="/test" element={<QuizPage />} />
        <Route path="/formulaire" element={<LeadFormPage />} />
        <Route path="/resultats" element={<ResultsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mentions-legales" element={<LegalPage />} />
      </Routes>
    </BrowserRouter>
  )
}
