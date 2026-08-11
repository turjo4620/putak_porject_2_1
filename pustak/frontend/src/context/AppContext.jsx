import { createContext, useContext, useState, useEffect } from 'react'

// Context
const AppContext = createContext(null)

// Provider
export function AppProvider({ children }) {
  // State
  const [cartItems, setCartItems]   = useState([])
  const [wishItems, setWishItems]   = useState([])
  const [cartOpen, setCartOpen]     = useState(false)
  const [wishOpen, setWishOpen]     = useState(false)
  const [previewBook, setPreviewBook] = useState(null)

  // Auth (persisted to localStorage)
  const [authUser, setAuthUserState] = useState(() => {
    try {
      const raw = localStorage.getItem('pustak-auth-user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  const setAuthUser = (user) => {
    try {
      if (user) localStorage.setItem('pustak-auth-user', JSON.stringify(user))
      else localStorage.removeItem('pustak-auth-user')
    } catch (e) {
      // ignore
    }
    setAuthUserState(user)
  }

  const signOut = () => {
    try {
      localStorage.removeItem('pustak-auth-user')
      localStorage.removeItem('pustak-auth-token')
    } catch (e) {
      // ignore
    }
    setAuthUserState(null)
  }

  // Database
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)

  // Fetch
  const fetchBooks = async (page = 1, limit = 20) => {
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:5000/api/books?page=${page}&limit=${limit}`)
      const json = await res.json()
      
      setBooks(json.data)
      setPagination({
        total: json.total,
        currentPage: json.currentPage,
        totalPages: json.totalPages
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Init
  useEffect(() => {
    fetchBooks()
  }, [])

  // Cart
  const addToCart = (book) => {
    // normalize
    const item = {
      ...book,
      title: book.title || book.book_name,
      cover: book.cover || book.cover_image_url,
      price: book.price || book.discount_price,
    }
    setCartItems((prev) => {
      if (prev.find((b) => b.id === item.id)) return prev
      return [...prev, { ...item, qty: 1 }]
    })
    setCartOpen(true)
  }

  // Remove
  const removeFromCart = (id) => setCartItems((p) => p.filter((b) => b.id !== id))

  // Wishlist
  const toggleWish = (book) => {
    // normalize
    const item = {
      ...book,
      title: book.title || book.book_name,
      cover: book.cover || book.cover_image_url,
      price: book.price || book.discount_price,
    }
    setWishItems((prev) =>
      prev.find((b) => b.id === item.id)
        ? prev.filter((b) => b.id !== item.id)
        : [...prev, item]
    )
  }

  // Checks
  const isWished = (id) => wishItems.some((b) => b.id === id)
  const isInCart = (id) => cartItems.some((b) => b.id === id)

  // Total
  const totalCartPrice = cartItems.reduce((sum, b) => sum + b.price * b.qty, 0)

  // Render
  return (
    <AppContext.Provider value={{
      cartItems, addToCart, removeFromCart,
      wishItems, toggleWish, isWished, isInCart,
      cartOpen, setCartOpen,
      wishOpen, setWishOpen,
      previewBook, setPreviewBook,
      totalCartPrice,
      books, loading, pagination, fetchBooks,
      // Auth
      authUser, setAuthUser, signOut
    }}>
      {children}
    </AppContext.Provider>
  )
}

// Hook
export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('Error')
  return ctx
}