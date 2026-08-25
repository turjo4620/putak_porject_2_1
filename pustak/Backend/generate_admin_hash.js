const bcrypt = require('bcrypt');

// Generate hash for the default admin password
const password = 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('\n=== Admin Password Hash Generated ===');
  console.log('\nPassword:', password);
  console.log('Hash:', hash);
  console.log('\nUse this hash in your SQL INSERT statement:');
  console.log(`\nINSERT INTO users (user_id, name, email, phone_number, password_hash, status, is_admin)`);
  console.log(`VALUES (`);
  console.log(`    999999,`);
  console.log(`    'Admin User',`);
  console.log(`    'admin@pustak.com',`);
  console.log(`    '0000000000',`);
  console.log(`    '${hash}',`);
  console.log(`    'Active',`);
  console.log(`    TRUE`);
  console.log(`)`);
  console.log(`ON CONFLICT (user_id) DO NOTHING;\n`);
});
