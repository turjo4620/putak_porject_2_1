import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="notfound">
      <div className="notfound__content">
        <div className="notfound__icon" aria-hidden="true">📚</div>
        <h1 className="notfound__code">৪০৪</h1>
        <h2 className="notfound__title">পৃষ্ঠাটি পাওয়া যায়নি</h2>
        <p className="notfound__text">
          আপনি যে পৃষ্ঠাটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা আর পাওয়া যাচ্ছে না।
        </p>
        <div className="notfound__actions">
          <Link to="/" className="notfound__btn notfound__btn--primary">হোমে ফিরুন</Link>
          <Link to="/bestsellers" className="notfound__btn notfound__btn--ghost">বেস্টসেলার দেখুন</Link>
        </div>
      </div>
    </div>
  )
}
