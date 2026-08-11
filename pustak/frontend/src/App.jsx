import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './styles/App.css'

import { AppProvider } from './context/AppContext'
import Navigation from './components/Navigation'
import Footer from './components/Footer'

import HomePage        from './pages/HomePage'
import BookDetailPage  from './pages/BookDetailPage'
import SearchPage      from './pages/SearchPage'
import CategoryPage    from './pages/CategoryPage'
import CategoriesPage  from './pages/CategoriesPage'
import BestSellersPage from './pages/BestSellersPage'
import NewArrivalsPage from './pages/NewArrivalsPage'
import OffersPage      from './pages/OffersPage'
import AuthorsPage     from './pages/AuthorsPage'
import AuthorPage      from './pages/AuthorPage'
import PublicationPage from './pages/PublicationPage'
import PublishersPage  from './pages/PublishersPage'
import CheckoutPage    from './pages/CheckoutPage'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import NotFoundPage    from './pages/NotFoundPage'

// Import the Account Dashboard components
import AccountDashboardLayout from './pages/AccountDashboardLayout.jsx'
import AccountProfileCard     from './pages/AccountProfileCard'
import AccountOrders          from './pages/AccountOrders'
import AccountWishlist        from './pages/AccountWishlist'
import AccountReviews         from './pages/AccountReviews'

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
            <Route path="/categories"        element={<CategoriesPage />} />
            <Route path="/category/:id"      element={<CategoryPage />} />
            <Route path="/bestsellers"       element={<BestSellersPage />} />
            <Route path="/new-arrivals"      element={<NewArrivalsPage />} />
            <Route path="/offers"            element={<OffersPage />} />
            <Route path="/authors"           element={<AuthorsPage />} />
            {/* 
              Swapped :name for :id below! 
              Now React Router knows to pass the ID number to AuthorPage.jsx 
            */}
            <Route path="/author/:id"        element={<AuthorPage />} />
            <Route path="/publishers"        element={<PublishersPage />} />
            <Route path="/publisher/:id"    element={<PublicationPage />} />
            <Route path="/checkout"          element={<CheckoutPage />} />
            <Route path="/login"             element={<LoginPage />} />
            <Route path="/register"          element={<RegisterPage />} />
            
            {/* --- NEW NESTED ACCOUNT ROUTES --- */}
            <Route path="/account" element={<AccountDashboardLayout />}>
              <Route index element={<AccountProfileCard />} /> 
              <Route path="info" element={<AccountProfileCard />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="wishlist" element={<AccountWishlist />} />
              <Route path="reviews" element={<AccountReviews />} />
            </Route>

            <Route path="/orders"            element={<LoginPage />} />
            <Route path="/settings"          element={<LoginPage />} />
            <Route path="*"                  element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  )
}