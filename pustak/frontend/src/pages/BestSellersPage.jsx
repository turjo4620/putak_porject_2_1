import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import './ListPage.css'

export default function BestSellersPage() {
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books/bestsellers?limit=50')
        const data = await response.json()
        setBestSellers(data.data || [])
      } catch (error) {
        console.error('Error fetching bestsellers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBestsellers()
  }, [])

  if (loading) {
    return (
      <div className="list-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '2rem' }}>লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="list-page">
      <div className="container">
        <div className="list-page__header">
          <p className="list-page__breadcrumb"><Link to="/">হোম</Link> › বেস্টসেলার</p>
          <h1 className="list-page__title">বেস্টসেলার বই</h1>
          <p className="list-page__count">সবচেয়ে বেশি পড়া {bestSellers.length} টি বই</p>
        </div>
        <div className="list-page__grid">
          {bestSellers.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </div>
    </div>
  )
}
