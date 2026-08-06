import { useEffect } from 'react'
import Hero from '../components/hero/Hero'
import BookOpening from '../components/transition/BookOpening'
import FeaturedBooks from '../components/featured/FeaturedBooks'
import Bookshelf from '../components/bookshelf/Bookshelf'
import Categories from '../components/categories/Categories'
import Authors from '../components/authors/Authors'
import Testimonials from '../components/testimonials/Testimonials'
import Newsletter from '../components/newsletter/Newsletter'

export default function Home() {
  useEffect(() => {
    document.title = 'PUSTAK — Where Every Story Begins'
  }, [])

  return (
    <main>
      <Hero />
      <BookOpening />
      <FeaturedBooks />
      <Bookshelf />
      <Categories />
      <Authors />
      <Testimonials />
      <Newsletter />
    </main>
  )
}
