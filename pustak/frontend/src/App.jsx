import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, ScrollRestoration, useLocation } from 'react-router-dom'
import './styles/App.css'

import { AppProvider } from './context/AppContext'
import Navigation from './components/Navigation'
import Footer from './components/Footer'

import HomePage        from './pages/HomePage'
import BookDetailPage  from './pages/BookDetailPage'
import SearchPage      from './pages/SearchPage'
import CategoryPage    from './pages/CategoryPage'
import BestSellersPage from './pages/BestSellersPage'
import NewArrivalsPage from './pages/NewArrivalsPage'
import OffersPage      from './pages/OffersPage'
import AuthorsPage     from './pages/AuthorsPage'
import AuthorPage      from './pages/AuthorPage'
import PublishersPage  from './pages/PublishersPage'
import CheckoutPage    from './pages/CheckoutPage'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import NotFoundPage    from './pages/NotFoundPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [pathname])
  return null
}

function Layout({ children, isDarkMode, toggleDarkMode }) {
  return (
    <div className="app">
      <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : '')
  }, [isDarkMode])

  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <Layout isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)}>
          <Routes>
            <Route path="/"                  element={<HomePage />} />
            <Route path="/book/:id"          element={<BookDetailPage />} />
            <Route path="/search"            element={<SearchPage />} />
            <Route path="/category/:id"      element={<CategoryPage />} />
            <Route path="/bestsellers"       element={<BestSellersPage />} />
            <Route path="/new-arrivals"      element={<NewArrivalsPage />} />
            <Route path="/offers"            element={<OffersPage />} />
            <Route path="/authors"           element={<AuthorsPage />} />
            <Route path="/author/:name"      element={<AuthorPage />} />
            <Route path="/publishers"        element={<PublishersPage />} />
            <Route path="/publisher/:name"   element={<PublishersPage />} />
            <Route path="/checkout"          element={<CheckoutPage />} />
            <Route path="/login"             element={<LoginPage />} />
            <Route path="/register"          element={<RegisterPage />} />
            <Route path="/orders"            element={<LoginPage />} />
            <Route path="/settings"          element={<LoginPage />} />
            <Route path="*"                  element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  )
}
