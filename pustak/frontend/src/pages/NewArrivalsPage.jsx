import { Link } from 'react-router-dom'
import { newReleases } from '../data/books'
import BookCard from '../components/BookCard'
import './ListPage.css'

export default function NewArrivalsPage() {
  return (
    <div className="list-page">
      <div className="container">
        <div className="list-page__header">
          <p className="list-page__breadcrumb"><Link to="/">হোম</Link> › নতুন বই</p>
          <h1 className="list-page__title">নতুন প্রকাশিত বই</h1>
          <p className="list-page__count">এই মাসের {newReleases.length} টি নতুন বই</p>
        </div>
        <div className="list-page__grid">
          {newReleases.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </div>
    </div>
  )
}
