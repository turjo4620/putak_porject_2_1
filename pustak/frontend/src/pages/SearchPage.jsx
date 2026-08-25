import { useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import './ListPage.css'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const searchBooks = async () => {
      if (!q.trim()) {
        setResults([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5000/api/books/search?q=${encodeURIComponent(q)}&limit=100`)
        const data = await response.json()
        setResults(data.data || [])
      } catch (error) {
        console.error('Error searching books:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    searchBooks()
  }, [q])

  if (loading) {
    return (
      <div className="list-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '2rem' }}>খুঁজছি...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="list-page">
      <div className="container">
        <div className="list-page__header">
          <p className="list-page__breadcrumb">
            <Link to="/">হোম</Link> › অনুসন্ধান ফলাফল
          </p>
          <h1 className="list-page__title">
            "{q}" এর ফলাফল
          </h1>
          <p className="list-page__count">{results.length} টি বই পাওয়া গেছে</p>
        </div>

        {results.length === 0 ? (
          <div className="list-page__empty">
            <p>কোনো বই পাওয়া যায়নি। অন্য কিছু খুঁজুন।</p>
            <Link to="/" className="list-page__back-btn">হোমে ফিরুন</Link>
          </div>
        ) : (
          <div className="list-page__grid">
            {results.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        )}
      </div>
    </div>
  )
}
