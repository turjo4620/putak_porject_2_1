import { useEffect } from 'react'
import { categories } from '../data/categories'
import CategoryCard from '../components/categories/CategoryCard'
import SectionTitle from '../components/common/SectionTitle'

export default function CategoriesPage() {
  useEffect(() => {
    document.title = 'Categories — PUSTAK'
  }, [])

  return (
    <main className="min-h-screen bg-cream pt-28">
      <div className="section-padding py-16">
        <div className="mb-16">
          <SectionTitle
            eyebrow="Browse by Genre"
            title="Categories"
            subtitle="Every kind of story, perfectly organized."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-darkBrown/5">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
