import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SmoothScroll from './components/layout/SmoothScroll'
import CustomCursor from './components/layout/CustomCursor'
import Home from './pages/Home'
import Books from './pages/Books'
import BookDetails from './pages/BookDetails'
import AuthorsPage from './pages/AuthorsPage'
import CategoriesPage from './pages/CategoriesPage'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/books" element={<PageWrapper><Books /></PageWrapper>} />
          <Route path="/books/:id" element={<PageWrapper><BookDetails /></PageWrapper>} />
          <Route path="/authors" element={<PageWrapper><AuthorsPage /></PageWrapper>} />
          <Route path="/categories" element={<PageWrapper><CategoriesPage /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><Home /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <CustomCursor />
        <AppRoutes />
      </SmoothScroll>
    </BrowserRouter>
  )
}
