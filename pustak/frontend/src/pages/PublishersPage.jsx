import { Link, useNavigate } from 'react-router-dom'
import { publishers } from '../data/books'
import './ListPage.css'
import './PublishersPage.css'

export default function PublishersPage() {
  const navigate = useNavigate()

  return (
    <div className="list-page">
      <div className="container">
        <div className="list-page__header">
          <p className="list-page__breadcrumb"><Link to="/">হোম</Link> › প্রকাশক</p>
          <h1 className="list-page__title">সকল প্রকাশনী</h1>
          <p className="list-page__count">{publishers.length} টি প্রকাশনী</p>
        </div>
        <div className="publishers-page-grid">
          {publishers.map((p) => (
            <div
              key={p.id}
              className="pub-page-card"
              onClick={() => navigate(`/publisher/${encodeURIComponent(p.name)}`)}
              role="button"
              tabIndex={0}
              aria-label={p.name}
            >
              <div className="pub-page-card__logo">{p.logo}</div>
              <strong>{p.name}</strong>
              <span>{p.books} টি বই</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
