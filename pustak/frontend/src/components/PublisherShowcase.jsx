import { publishers } from '../data/books'
import SectionHeader from './SectionHeader'
import './PublisherShowcase.css'

export default function PublisherShowcase() {
  return (
    <section className="publishers section-sm" aria-label="প্রকাশক পরিচিতি">
      <div className="container">
        <SectionHeader
          label="প্রকাশক"
          title="বিশ্বস্ত প্রকাশনী"
          align="center"
        />
        <div className="publishers__grid">
          {publishers.map((pub) => (
            <a key={pub.id} href="#" className="publisher-card" aria-label={`${pub.name} — ${pub.books} টি বই`}>
              <div className="publisher-card__logo">{pub.logo}</div>
              <div className="publisher-card__info">
                <strong>{pub.name}</strong>
                <span>{pub.books} টি বই</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
