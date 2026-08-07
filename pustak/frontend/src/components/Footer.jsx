import './Footer.css'

const footerLinks = {
  'বই খুঁজুন': ['উপন্যাস', 'কবিতা', 'বিজ্ঞান', 'ইতিহাস', 'আত্মউন্নয়ন', 'শিশুদের বই'],
  'সাহায্য': ['অর্ডার ট্র্যাক', 'রিটার্ন নীতি', 'ডেলিভারি তথ্য', 'প্রশ্ন উত্তর'],
  'কোম্পানি': ['আমাদের সম্পর্কে', 'ব্লগ', 'চাকরি', 'যোগাযোগ'],
}

const socialLinks = [
  { name: 'Facebook', icon: 'ফ', href: '#' },
  { name: 'Instagram', icon: 'ই', href: '#' },
  { name: 'Twitter', icon: 'ট', href: '#' },
  { name: 'YouTube', icon: 'ই', href: '#' },
]

const payments = ['Visa', 'MasterCard', 'bKash', 'Nagad', 'DBBL']

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="পুস্তক">
                <path d="M6 33 Q28 37 50 35 Q72 33 94 36" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.3"/>
                <text x="50" y="27" textAnchor="middle" fontFamily="'Noto Serif Bengali', serif" fontWeight="700" fontSize="23" fill="currentColor">পুস্তক</text>
              </svg>
            </div>
            <p className="footer__tagline">
              বাংলাদেশের সেরা অনলাইন বইয়ের দোকান। জ্ঞান, সংস্কৃতি ও সাহিত্যের ডিজিটাল সেতু।
            </p>
            <div className="footer__social" aria-label="সোশ্যাল মিডিয়া">
              {socialLinks.map((s) => (
                <a key={s.name} href={s.href} className="footer__social-btn" aria-label={s.name}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="footer__col">
              <h3 className="footer__heading">{heading}</h3>
              <ul className="footer__links" role="list">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer__link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="footer__divider" role="separator" />

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © ২০২৪ পুস্তক। সকল অধিকার সংরক্ষিত।
          </p>
          <div className="footer__payments" aria-label="পেমেন্ট পদ্ধতি">
            {payments.map((p) => (
              <span key={p} className="footer__payment-badge">{p}</span>
            ))}
          </div>
          <div className="footer__legal">
            <a href="#" className="footer__legal-link">গোপনীয়তা নীতি</a>
            <a href="#" className="footer__legal-link">শর্তাবলী</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
