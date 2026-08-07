import { useParams, Link } from 'react-router-dom'
import { bestSellers, newReleases, categories } from '../data/books'
import BookCard from '../components/BookCard'
import './ListPage.css'

const allBooks = [...bestSellers, ...newReleases]

export default function CategoryPage() {
  const { id } = useParams()
  const catInfo = categories.find((c) => c.id === id)

  const books = allBooks.filter((b) =>
    catInfo ? (b.category === catInfo.name || b.category.includes(catInfo.name)) : true
  )

  // fallback: show all books if no match found for category
  const displayBooks = books.length > 0 ? books : allBooks

  return (
    <div className="list-page">
      <div className="container">
        <div className="list-page__header">
          <p className="list-page__breadcrumb">
            <Link to="/">হোম</Link> › বিভাগ › {catInfo?.name ?? id}
          </p>
          <h1 className="list-page__title">
            {catInfo ? (
              <><span className="list-page__icon">{catInfo.icon}</span> {catInfo.name}</>
            ) : id}
          </h1>
          <p className="list-page__count">{displayBooks.length} টি বই</p>
        </div>
        <div className="list-page__grid">
          {displayBooks.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </div>
    </div>
  )
}
