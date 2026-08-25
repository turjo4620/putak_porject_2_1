/**
 * Admin Routes Verification Script
 * Run with: node verify-admin-routes.cjs
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Admin Routes Setup...\n');

let allChecksPass = true;

// Check 1: Verify all admin page files exist
console.log('📁 Checking admin page files...');
const adminFiles = [
  'AdminLogin.jsx',
  'AdminLayout.jsx',
  'AdminDashboard.jsx',
  'AdminBooks.jsx',
  'AdminAuthors.jsx',
  'AdminPublications.jsx',
  'AdminCategories.jsx',
  'AdminUsers.jsx',
  'AdminOrders.jsx',
  'AdminReviews.jsx',
  'AdminAnalytics.jsx'
];

const adminDir = path.join(__dirname, 'src', 'pages', 'admin');
adminFiles.forEach(file => {
  const filePath = path.join(adminDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING!`);
    allChecksPass = false;
  }
});

// Check 2: Verify ProtectedRoute exists
console.log('\n🔒 Checking ProtectedRoute component...');
const protectedRoutePath = path.join(__dirname, 'src', 'components', 'ProtectedRoute.jsx');
if (fs.existsSync(protectedRoutePath)) {
  console.log('   ✅ ProtectedRoute.jsx exists');
} else {
  console.log('   ❌ ProtectedRoute.jsx - MISSING!');
  allChecksPass = false;
}

// Check 3: Verify admin.css exists
console.log('\n🎨 Checking admin styles...');
const adminCssPath = path.join(__dirname, 'src', 'styles', 'admin.css');
if (fs.existsSync(adminCssPath)) {
  console.log('   ✅ admin.css exists');
} else {
  console.log('   ❌ admin.css - MISSING!');
  allChecksPass = false;
}

// Check 4: Verify App.jsx has correct imports
console.log('\n📦 Checking App.jsx imports...');
const appJsxPath = path.join(__dirname, 'src', 'App.jsx');
if (fs.existsSync(appJsxPath)) {
  const appContent = fs.readFileSync(appJsxPath, 'utf8');
  
  if (appContent.includes("import AdminLogin from './pages/admin/AdminLogin")) {
    console.log('   ✅ AdminLogin imported');
  } else {
    console.log('   ❌ AdminLogin import - MISSING!');
    allChecksPass = false;
  }
  
  if (appContent.includes("import ProtectedRoute from './components/ProtectedRoute")) {
    console.log('   ✅ ProtectedRoute imported');
  } else {
    console.log('   ⚠️  ProtectedRoute import - NOT FOUND (optional)');
  }
  
  if (appContent.includes('path="/admin/login"')) {
    console.log('   ✅ Admin login route defined');
  } else {
    console.log('   ❌ Admin login route - MISSING!');
    allChecksPass = false;
  }
} else {
  console.log('   ❌ App.jsx - MISSING!');
  allChecksPass = false;
}

// Check 5: Verify vite.config.js
console.log('\n⚙️  Checking Vite configuration...');
const viteConfigPath = path.join(__dirname, 'vite.config.js');
if (fs.existsSync(viteConfigPath)) {
  const viteContent = fs.readFileSync(viteConfigPath, 'utf8');
  
  if (viteContent.includes('historyApiFallback')) {
    console.log('   ✅ historyApiFallback configured');
  } else {
    console.log('   ⚠️  historyApiFallback not found - SPA routing may not work on refresh');
  }
  
  if (viteContent.includes('proxy')) {
    console.log('   ✅ API proxy configured');
  } else {
    console.log('   ⚠️  API proxy not configured');
  }
} else {
  console.log('   ❌ vite.config.js - MISSING!');
  allChecksPass = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allChecksPass) {
  console.log('✅ All checks passed! Admin routes should work correctly.');
  console.log('\nNext steps:');
  console.log('1. Restart your dev server: npm run dev');
  console.log('2. Clear browser cache or use incognito mode');
  console.log('3. Navigate to http://localhost:5173/admin/login');
  console.log('4. Login with: admin@pustak.com / admin123');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
}
console.log('='.repeat(50) + '\n');
