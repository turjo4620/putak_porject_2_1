import { newReleases } from '../data/books'
import BookCard from './BookCard'
import SectionHeader from './SectionHeader'
import './NewlyReleased.css'

export default function NewlyReleased() {
  return (
    <section className="newly section" aria-label="নতুন প্রকাশিত বই">
      <div className="container">
        <SectionHeader
          label="নতুন প্রকাশ"
          title="সদ্য প্রকাশিত"
          subtitle="এই মাসের নতুন বই"
          linkText="সব নতুন বই"
        />
        <div className="newly__grid">
          {newReleases.slice(0, 5).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
}
