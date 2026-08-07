import { Link, useNavigate } from 'react-router-dom'
import { authors } from '../data/books'
import './ListPage.css'
import './AuthorsPage.css'

export default function AuthorsPage() {
  const navigate = useNavigate()

  // Build unique author list from all data
  const allAuthors = [
    ...authors,
    { id: 2, name: 'মুহম্মদ জাফর ইকবাল', books: 80, avatar: 'জা', genre: 'বিজ্ঞান কল্পকাহিনী' },
    { id: 3, name: 'সুনীল গঙ্গোপাধ্যায়', books: 120, avatar: 'সু', genre: 'উপন্যাস, কবিতা' },
    { id: 4, name: 'রবীন্দ্রনাথ ঠাকুর',   books: 300, avatar: 'র',  genre: 'কবিতা, উপন্যাস' },
    { id: 5, name: 'জাহানারা ইমাম',        books: 15,  avatar: 'জা', genre: 'ইতিহাস, স্মৃতিকথা' },
    { id: 6, name: 'আনিসুল হক',            books: 60,  avatar: 'আ',  genre: 'উপন্যাস, নাটক' },
  ]

  return (
    <div className="list-page">
      <div className="container">
        <div className="list-page__header">
          <p className="list-page__breadcrumb"><Link to="/">হোম</Link> › লেখক</p>
          <h1 className="list-page__title">সকল লেখক</h1>
          <p className="list-page__count">{allAuthors.length} জন লেখক</p>
        </div>
        <div className="authors-grid">
          {allAuthors.map((a) => (
            <div
              key={a.id}
              className="author-card"
              onClick={() => navigate(`/author/${encodeURIComponent(a.name)}`)}
              role="button"
              tabIndex={0}
              aria-label={a.name}
            >
              <div className="author-card__avatar">{a.avatar}</div>
              <div className="author-card__info">
                <strong>{a.name}</strong>
                <span>{a.genre}</span>
                <em>{a.books}+ বই</em>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
