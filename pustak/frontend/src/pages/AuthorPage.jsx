import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import './AuthorPage.css'

const BOOKS_PER_PAGE = 20

export default function AuthorPage() {
  const { id } = useParams()

  const [author, setAuthor] = useState(null)
  const [books, setBooks] = useState([])
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [booksLoading, setBooksLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Load author info once, and books for page 1
  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setPage(1)

    Promise.all([
      fetch(`http://localhost:5000/api/authors/${id}`).then(res => res.json()),
      fetch(`http://localhost:5000/api/books/author/${id}?page=1&limit=${BOOKS_PER_PAGE}`).then(res => res.json())
    ])
      .then(([authorJson, booksJson]) => {
        if (authorJson.success) {
          setAuthor(authorJson.data)
        } else {
          setNotFound(true)
        }

        if (booksJson.data) {
          setBooks(booksJson.data)
          setTotalBooks(booksJson.total || 0)
          setTotalPages(booksJson.totalPages || 1)
        }

        setLoading(false)
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setNotFound(true)
        setLoading(false)
      })
  }, [id])

  // Load a specific page of books (after the first)
  const goToPage = (newPage) => {
    if (newPage === page || newPage < 1 || newPage > totalPages) return
    setBooksLoading(true)
    fetch(`http://localhost:5000/api/books/author/${id}?page=${newPage}&limit=${BOOKS_PER_PAGE}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setBooks(json.data)
          setPage(newPage)
        }
        setBooksLoading(false)
        document.querySelector('.author-page__books')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setBooksLoading(false)
      })
  }

  if (loading) {
    return (
      <div className="author-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '2rem' }}>লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (notFound || !author) {
    return (
      <div className="author-page">
        <div className="container">
          <p className="list-page__breadcrumb">
            <Link to="/">হোম</Link> › <Link to="/authors">লেখক</Link>
          </p>
          <h1>লেখক খুঁজে পাওয়া যায়নি</h1>
          <p><Link to="/authors">সকল লেখক দেখুন</Link></p>
        </div>
      </div>
    )
  }

  // Build a compact page list: 1 ... p-1 p p+1 ... totalPages
  const pageNumbers = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
  } else {
    pageNumbers.push(1)
    if (page > 3) pageNumbers.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pageNumbers.push(i)
    }
    if (page < totalPages - 2) pageNumbers.push('...')
    pageNumbers.push(totalPages)
  }

  return (
    <div className="author-page">
      <div className="container">
        <p className="list-page__breadcrumb">
          <Link to="/">হোম</Link> › <Link to="/authors">লেখক</Link> › {author.name}
        </p>

        <div className="author-page__header">
          <div className="author-page__avatar">
            {author.name ? author.name.charAt(0) : '?'}
          </div>
          <div className="author-page__info">
            <h1>{author.name}</h1>
            {author.bio && <p className="author-page__bio">{author.bio}</p>}
            <p className="author-page__book-count">{totalBooks} টি বই</p>
          </div>
        </div>

        <div className="author-page__books">
          {totalBooks === 0 ? (
            <p style={{ padding: '2rem 0' }}>এই লেখকের কোনো বই পাওয়া যায়নি।</p>
          ) : (
            <>
              <div className={`author-page__books-grid ${booksLoading ? 'author-page__books-grid--loading' : ''}`}>
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="author-page__pagination" aria-label="পৃষ্ঠা নেভিগেশন">
                  <button
                    className="author-page__page-btn"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    aria-label="পূর্ববর্তী পৃষ্ঠা"
                  >
                    ‹
                  </button>

                  {pageNumbers.map((p, idx) =>
                    p === '...' ? (
                      <span key={`ellipsis-${idx}`} className="author-page__page-ellipsis">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`author-page__page-btn ${p === page ? 'author-page__page-btn--active' : ''}`}
                        onClick={() => goToPage(p)}
                        aria-current={p === page ? 'page' : undefined}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    className="author-page__page-btn"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    aria-label="পরবর্তী পৃষ্ঠা"
                  >
                    ›
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
