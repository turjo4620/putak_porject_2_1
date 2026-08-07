import { useParams, Link } from 'react-router-dom'
import { bestSellers, newReleases } from '../data/books'
import BookCard from '../components/BookCard'
import './ListPage.css'
import './AuthorPage.css'

const allBooks = [...bestSellers, ...newReleases]

export default function AuthorPage() {
  const { name } = useParams()
  const authorName = decodeURIComponent(name)
  const books = allBooks.filter((b) => b.author === authorName)
  const displayBooks = books.length > 0 ? books : allBooks.slice(0, 4)

  return (
    <div className="list-page">
      <div className="container">
        <div className="list-page__header">
          <p className="list-page__breadcrumb">
            <Link to="/">হোম</Link> › <Link to="/authors">লেখক</Link> › {authorName}
          </p>
          <div className="author-profile">
            <div className="author-profile__avatar">
              {authorName.charAt(0)}
            </div>
            <div>
              <h1 className="author-profile__name">{authorName}</h1>
              <p className="author-profile__count">{displayBooks.length} টি বই পাওয়া গেছে</p>
            </div>
          </div>
        </div>
        <div className="list-page__grid">
          {displayBooks.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </div>
    </div>
  )
}
