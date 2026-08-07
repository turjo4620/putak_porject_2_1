import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [cartItems, setCartItems]   = useState([])
  const [wishItems, setWishItems]   = useState([])
  const [cartOpen, setCartOpen]     = useState(false)
  const [wishOpen, setWishOpen]     = useState(false)
  const [previewBook, setPreviewBook] = useState(null)

  const addToCart = (book) => {
    setCartItems((prev) => {
      if (prev.find((b) => b.id === book.id)) return prev
      return [...prev, { ...book, qty: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id) => setCartItems((p) => p.filter((b) => b.id !== id))

  const toggleWish = (book) => {
    setWishItems((prev) =>
      prev.find((b) => b.id === book.id)
        ? prev.filter((b) => b.id !== book.id)
        : [...prev, book]
    )
  }

  const isWished = (id) => wishItems.some((b) => b.id === id)
  const isInCart = (id) => cartItems.some((b) => b.id === id)

  const totalCartPrice = cartItems.reduce((sum, b) => sum + b.price * b.qty, 0)

  return (
    <AppContext.Provider value={{
      cartItems, addToCart, removeFromCart,
      wishItems, toggleWish, isWished, isInCart,
      cartOpen, setCartOpen,
      wishOpen, setWishOpen,
      previewBook, setPreviewBook,
      totalCartPrice,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
