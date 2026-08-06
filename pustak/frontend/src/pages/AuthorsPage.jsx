import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { authors } from '../data/authors'
import AuthorCard from '../components/authors/AuthorCard'
import SectionTitle from '../components/common/SectionTitle'

export default function AuthorsPage() {
  useEffect(() => {
    document.title = 'Authors — PUSTAK'
  }, [])

  return (
    <main className="min-h-screen bg-cream pt-28">
      <div className="section-padding py-16">
        <div className="mb-16">
          <SectionTitle
            eyebrow="The Voices"
            title="Authors"
            subtitle="The storytellers who shaped our literary world."
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {authors.map((author, i) => (
            <AuthorCard key={author.id} author={author} index={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
