import { Link } from 'react-router-dom'
import { bestSellers, newReleases } from '../data/books'
import BookCard from '../components/BookCard'
import './ListPage.css'

const allBooks = [...bestSellers, ...newReleases].filter((b) => b.discount >= 18)

export default function OffersPage() {
  return (
    <div className="list-page">
      <div className="container">
        <div className="list-page__header">
          <p className="list-page__breadcrumb"><Link to="/">হোম</Link> › আজকের অফার</p>
          <h1 className="list-page__title">আজকের বিশেষ অফার</h1>
          <p className="list-page__subtitle">১৮% বা তার বেশি ছাড়ে পাওয়া যাচ্ছে</p>
          <p className="list-page__count">{allBooks.length} টি বই</p>
        </div>
        <div className="list-page__grid">
          {allBooks.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </div>
    </div>
  )
}
