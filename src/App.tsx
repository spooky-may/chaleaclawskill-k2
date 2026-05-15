import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ChaleaAppLayout } from './components/AppLayout'
import { ChaleaSplash } from './components/ChaleaSplash'
import { ChaleaErrorBoundary } from './components/ChaleaErrorBoundary'
import { ChaleaToastStack } from './components/ChaleaToastStack'
import { HomePage } from './pages/HomePage'
import { BrowsePage } from './pages/BrowsePage'
import { SkillDetailPage } from './pages/SkillDetailPage'
import { DashboardPage } from './pages/DashboardPage'
import { DocsPage } from './pages/DocsPage'
import { FAQPage } from './pages/FAQPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { BookmarksPage } from './pages/BookmarksPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'

function AppContent() {
  return (
    <ChaleaAppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/skill/:slug" element={<SkillDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Routes>
    </ChaleaAppLayout>
  )
}

function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <ChaleaErrorBoundary>
      {!splashDone && <ChaleaSplash onDone={() => setSplashDone(true)} />}
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
            <ChaleaToastStack />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChaleaErrorBoundary>
  )
}

export default App
