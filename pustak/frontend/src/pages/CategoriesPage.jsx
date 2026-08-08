import { Link } from 'react-router-dom'
import './ListPage.css'
import './CategoriesPage.css'

const categories = [
  { id: 'upanyas', name: 'উপন্যাস' },
  { id: 'golpo', name: 'গল্প' },
  { id: 'kobita', name: 'কবিতা' },
  { id: 'natok', name: 'নাটক' },
  { id: 'rohossyo-goyenda', name: 'রহস্য ও গোয়েন্দা' },
  { id: 'thriller', name: 'থ্রিলার' },
  { id: 'atiprakrit-o-bhoyotik', name: 'অতিপ্রাকৃত ও ভৌতিক' },
  { id: 'science-fiction', name: 'সায়েন্স ফিকশন' },
  { id: 'romantic', name: 'রোমান্টিক' },
  { id: 'ramyo-vyong-rachona', name: 'রম্য ও ব্যঙ্গরচনা' },
  { id: 'chiroyoto-sahitto', name: 'চিরায়ত সাহিত্য' },
  { id: 'onubad-sahitto', name: 'অনুবাদ সাহিত্য' },
  { id: 'jiboni-smritichorron', name: 'জীবনী ও স্মৃতিচারণ' },
  { id: 'bhromon-kahini', name: 'ভ্রমণ কাহিনী' },
  { id: 'probondho-gobeshona', name: 'প্রবন্ধ ও গবেষণা' },
  { id: 'islami-boi', name: 'ইসলামি বই' },
  { id: 'dhormiyo-boi', name: 'ধর্মীয় বই' },
  { id: 'muktijuddho', name: 'মুক্তিযুদ্ধ' },
  { id: 'rajniti-o-itihash', name: 'রাজনীতি ও ইতিহাস' },
  { id: 'daroshon', name: 'দর্শন' },
  { id: 'biggan-o-projukti', name: 'বিজ্ঞান ও প্রযুক্তি' },
  { id: 'shongit', name: 'সংগীত' },
  { id: 'cholochchitro-o-binodon', name: 'চলচ্চিত্র ও বিনোদন' },
  { id: 'shishu-kishor-sahitto', name: 'শিশু-কিশোর সাহিত্য' },
  { id: 'reference-o-abhidhan', name: 'রেফারেন্স ও অভিধান' },
  { id: 'ranna-o-resepi', name: 'রান্না ও রেসিপি' },
  { id: 'shastho-o-jibonjatra', name: 'স্বাস্থ্য ও জীবনযাত্রা' },
  { id: 'atma-unnoayon', name: 'আত্ম-উন্নয়ন' },
  { id: 'bideshi-bhashar-boi', name: 'বিদেশি ভাষার বই' },
  { id: 'pashchim-bonger-boi', name: 'পশ্চিমবঙ্গের বই' },
]

export default function CategoriesPage() {
  return (
    <div className="list-page">
      <div className="container">
        <div className="list-page__header">
          <p className="list-page__breadcrumb">
            <Link to="/">হোম</Link> › বিভাগ
          </p>
          <h1>বিভাগসমূহ</h1>
          <p className="list-page__subtitle">নীচে ৩০টি প্রধান বিভাগ দেখুন</p>
        </div>

        <div className="categories-list-grid">
          {categories.map((category) => (
            <button key={category.id} className="category-card" type="button">
              <span className="category-card__name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
