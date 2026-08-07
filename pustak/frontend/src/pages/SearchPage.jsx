import { useSearchParams, Link } from 'react-router-dom'
import { bestSellers, newReleases } from '../data/books'
import BookCard from '../components/BookCard'
import './ListPage.css'

const allBooks = [...bestSellers, ...newReleases]

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''

  const results = allBooks.filter(
    (b) =>
      b.title.includes(q) ||
      b.author.includes(q) ||
      b.category.includes(q) ||
      b.publisher.includes(q)
  )

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
