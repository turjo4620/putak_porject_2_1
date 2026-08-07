import './ReadingInspiration.css'

const articles = [
  {
    id: 1,
    tag: 'পাঠ্য তালিকা',
    title: '২০২৪ সালে অবশ্যই পড়বেন যে ১০টি বই',
    excerpt: 'এই বছর বাংলা সাহিত্যে যে বইগুলো আলোচনার কেন্দ্রে ছিল তার একটি বিস্তারিত বিশ্লেষণ।',
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=380&fit=crop&q=80',
    readTime: '৫ মিনিট',
    featured: true,
  },
  {
    id: 2,
    tag: 'লেখক সাক্ষাৎকার',
    title: 'হুমায়ূন আহমেদের লেখালেখির গোপন রহস্য',
    excerpt: 'কিভাবে একজন বিজ্ঞানী হয়ে উঠলেন বাংলাদেশের সবচেয়ে জনপ্রিয় কথাসাহিত্যিক।',
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=280&fit=crop&q=80',
    readTime: '৮ মিনিট',
  },
  {
    id: 3,
    tag: 'পড়ার অভ্যাস',
    title: 'প্রতিদিন ৩০ মিনিট বই পড়লে জীবন বদলে যায়',
    excerpt: 'গবেষণা বলছে নিয়মিত পাঠাভ্যাস মস্তিষ্কের কার্যকারিতা বৃদ্ধি করে।',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=280&fit=crop&q=80',
    readTime: '৪ মিনিট',
  },
]

export default function ReadingInspiration() {
  return (
    <section className="inspiration section" aria-label="পড়ার অনুপ্রেরণা">
      <div className="container">
        <div className="inspiration__header">
          <div>
            <span className="inspiration__label">ব্লগ ও প্রবন্ধ</span>
            <h2 className="inspiration__title">পড়ার অনুপ্রেরণা</h2>
          </div>
          <a href="#" className="inspiration__more">সব পড়ুন →</a>
        </div>

        <div className="inspiration__grid">
          {/* Featured article */}
          <article className="insp-card insp-card--featured">
            <div className="insp-card__cover">
              <img src={articles[0].cover} alt={articles[0].title} loading="lazy" />
              <span className="insp-card__tag">{articles[0].tag}</span>
            </div>
            <div className="insp-card__body">
              <h3 className="insp-card__title">{articles[0].title}</h3>
              <p className="insp-card__excerpt">{articles[0].excerpt}</p>
              <div className="insp-card__meta">
                <span>{articles[0].readTime} পড়া</span>
                <a href="#">পড়ুন →</a>
              </div>
            </div>
          </article>

          {/* Secondary articles */}
          <div className="inspiration__secondary">
            {articles.slice(1).map((a) => (
              <article key={a.id} className="insp-card insp-card--sm">
                <div className="insp-card__cover insp-card__cover--sm">
                  <img src={a.cover} alt={a.title} loading="lazy" />
                  <span className="insp-card__tag">{a.tag}</span>
                </div>
                <div className="insp-card__body">
                  <h3 className="insp-card__title insp-card__title--sm">{a.title}</h3>
                  <p className="insp-card__excerpt insp-card__excerpt--sm">{a.excerpt}</p>
                  <div className="insp-card__meta">
                    <span>{a.readTime} পড়া</span>
                    <a href="#">পড়ুন →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
