import { Link } from 'react-router-dom'
import { bestSellers } from '../data/books'
import BookCard from '../components/BookCard'
import './ListPage.css'

export default function BestSellersPage() {
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
