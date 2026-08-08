import { Routes, Route } from 'react-router-dom'
import AccountDashboardLayout from './AccountDashboardLayout.jsx'
import AccountProfileCard from './AccountProfileCard'
import AccountOrders from './AccountOrders'
import AccountWishlist from './AccountWishlist'
import AccountReviews from './AccountReviews'

export default function AccountPage() {
  return (
    <AccountDashboardLayout>
      <Routes>
        <Route index element={<AccountProfileCard />} />
        <Route path="orders" element={<AccountOrders />} />
        <Route path="wishlist" element={<AccountWishlist />} />
        <Route path="reviews" element={<AccountReviews />} />
      </Routes>
    </AccountDashboardLayout>
  )
}
