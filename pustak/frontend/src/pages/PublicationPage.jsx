import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import './PublicationPage.css'

const BOOKS_PER_PAGE = 20

const getLogoText = (title) => {
  if (!title) return 'প্র'
  const words = title.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0].slice(0, 2)
  }
  return words.slice(0, 2).map(word => word[0]).join('')
}

export default function PublicationPage() {
  const { id } = useParams()
  const [publication, setPublication] = useState(null)
  const [books, setBooks] = useState([])
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [booksLoading, setBooksLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setPage(1)

    Promise.all([
      fetch(`http://localhost:5000/api/publications/${id}`).then(res => res.json()),
      fetch(`http://localhost:5000/api/books/publication/${id}?page=1&limit=${BOOKS_PER_PAGE}`).then(res => res.json())
    ])
      .then(([publicationJson, booksJson]) => {
        if (publicationJson.success) {
          setPublication(publicationJson.data)
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
        console.error('Fetch error:', err)
        setNotFound(true)
        setLoading(false)
      })
  }, [id])

  const goToPage = (newPage) => {
    if (newPage === page || newPage < 1 || newPage > totalPages) return

    setBooksLoading(true)
    fetch(`http://localhost:5000/api/books/publication/${id}?page=${newPage}&limit=${BOOKS_PER_PAGE}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setBooks(json.data)
          setPage(newPage)
        }
        setBooksLoading(false)
        document.querySelector('.publication-page__books')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setBooksLoading(false)
      })
  }

  if (loading) {
    return (
      <div className="publication-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '2rem' }}>লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (notFound || !publication) {
    return (
      <div className="publication-page">
        <div className="container">
          <p className="list-page__breadcrumb">
            <Link to="/">হোম</Link> › <Link to="/publishers">প্রকাশক</Link>
          </p>
          <h1>প্রকাশনী খুঁজে পাওয়া যায়নি</h1>
          <p><Link to="/publishers">সকল প্রকাশক দেখুন</Link></p>
        </div>
      </div>
    )
  }

  const pageNumbers = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) pageNumbers.push(i)
  } else {
    pageNumbers.push(1)
    if (page > 3) pageNumbers.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i += 1) {
      pageNumbers.push(i)
    }
    if (page < totalPages - 2) pageNumbers.push('...')
    pageNumbers.push(totalPages)
  }

  return (
    <div className="publication-page">
      <div className="container">
        <p className="list-page__breadcrumb">
          <Link to="/">হোম</Link> › <Link to="/publishers">প্রকাশক</Link> › {publication.title}
        </p>

        <div className="publication-page__header">
          <div className="publication-page__avatar">
            {publication.cover_image_url ? (
              <img src={publication.cover_image_url} alt={publication.title} />
            ) : (
              getLogoText(publication.title)
            )}
          </div>
          <div className="publication-page__info">
            <h1>{publication.title}</h1>
            {publication.bio && <p className="publication-page__bio">{publication.bio}</p>}
            <p className="publication-page__book-count">{totalBooks} টি বই</p>
          </div>
        </div>

        <div className="publication-page__books">
          {totalBooks === 0 ? (
            <p style={{ padding: '2rem 0' }}>এই প্রকাশনীর কোনো বই পাওয়া যায়নি।</p>
          ) : (
            <>
              <div className={`publication-page__books-grid ${booksLoading ? 'publication-page__books-grid--loading' : ''}`}>
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="publication-page__pagination" aria-label="পৃষ্ঠা নেভিগেশন">
                  <button
                    className="publication-page__page-btn"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    aria-label="পূর্ববর্তী পৃষ্ঠা"
                  >
                    ‹
                  </button>
                  {pageNumbers.map((p, idx) =>
                    p === '...' ? (
                      <span key={`ellipsis-${idx}`} className="publication-page__page-ellipsis">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`publication-page__page-btn ${p === page ? 'publication-page__page-btn--active' : ''}`}
                        onClick={() => goToPage(p)}
                        aria-current={p === page ? 'page' : undefined}
                      >
                        {p}
                      </button>
                    ))}
                  <button
                    className="publication-page__page-btn"
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
