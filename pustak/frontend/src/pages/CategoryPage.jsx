import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import './ListPage.css'
import './CategoryPage.css'

const BOOKS_PER_PAGE = 20

export default function CategoryPage() {
  const { id } = useParams()

  const [categoryName, setCategoryName] = useState('')
  const [books, setBooks] = useState([])
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [booksLoading, setBooksLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // load
  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setPage(1)

    fetch(`http://localhost:5000/api/books/category/${id}?page=1&limit=${BOOKS_PER_PAGE}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          setNotFound(true)
        } else {
          setCategoryName(json.categoryName || '')
          setBooks(json.data || [])
          setTotalBooks(json.total || 0)
          setTotalPages(json.totalPages || 1)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setNotFound(true)
        setLoading(false)
      })
  }, [id])

  // page
  const goToPage = (newPage) => {
    if (newPage === page || newPage < 1 || newPage > totalPages) return
    setBooksLoading(true)
    fetch(`http://localhost:5000/api/books/category/${id}?page=${newPage}&limit=${BOOKS_PER_PAGE}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setBooks(json.data)
          setPage(newPage)
        }
        setBooksLoading(false)
        document.querySelector('.category-page__books')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setBooksLoading(false)
      })
  }

  if (loading) {
    return (
      <div className="list-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '2rem' }}>লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="list-page">
        <div className="container">
          <p className="list-page__breadcrumb">
            <Link to="/">হোম</Link> › <Link to="/categories">বিভাগ</Link>
          </p>
          <h1>বিভাগ খুঁজে পাওয়া যায়নি</h1>
          <p><Link to="/categories">সকল বিভাগ দেখুন</Link></p>
        </div>
      </div>
    )
  }

  // pages
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
    <div className="list-page">
      <div className="container">
        <div className="list-page__header">
          <p className="list-page__breadcrumb">
            <Link to="/">হোম</Link> › <Link to="/categories">বিভাগ</Link> › {categoryName}
          </p>
          <h1 className="list-page__title">{categoryName}</h1>
          <p className="list-page__count">{totalBooks} টি বই</p>
        </div>

        <div className="category-page__books">
          {totalBooks === 0 ? (
            <p style={{ padding: '2rem 0' }}>এই বিভাগে কোনো বই পাওয়া যায়নি।</p>
          ) : (
            <>
              <div className={`list-page__grid ${booksLoading ? 'category-page__grid--loading' : ''}`}>
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="category-page__pagination" aria-label="পৃষ্ঠা নেভিগেশন">
                  <button
                    className="category-page__page-btn"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    aria-label="পূর্ববর্তী পৃষ্ঠা"
                  >
                    ‹
                  </button>

                  {pageNumbers.map((p, idx) =>
                    p === '...' ? (
                      <span key={`ellipsis-${idx}`} className="category-page__page-ellipsis">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`category-page__page-btn ${p === page ? 'category-page__page-btn--active' : ''}`}
                        onClick={() => goToPage(p)}
                        aria-current={p === page ? 'page' : undefined}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    className="category-page__page-btn"
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
