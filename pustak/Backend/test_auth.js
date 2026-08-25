// Test authentication endpoints
// Run this with: node test_auth.js

const API_BASE_URL = 'http://localhost:5000';

async function testCustomerLogin() {
    console.log('\n=== Testing Customer Login ===');
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'rahim.ahmed1@example.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.success) {
            console.log('✓ Customer login successful!');
            console.log('Token:', data.token);
            console.log('User:', data.user);
        } else {
            console.log('✗ Customer login failed:', data.message);
        }
    } catch (error) {
        console.error('✗ Error:', error.message);
    }
}

async function testAdminLogin() {
    console.log('\n=== Testing Admin Login ===');
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'sarkerturjo2022@gmail.com',
                password: 'admin123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.success) {
            console.log('✓ Admin login successful!');
            console.log('Token:', data.token);
            console.log('User:', data.user);
        } else {
            console.log('✗ Admin login failed:', data.message);
        }
    } catch (error) {
        console.error('✗ Error:', error.message);
    }
}

async function testWrongRoleLogin() {
    console.log('\n=== Testing Customer Trying Admin Login (Should Fail) ===');
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'rahim.ahmed1@example.com', // This is a customer account
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (!data.success) {
            console.log('✓ Correctly rejected customer trying to login as admin');
        } else {
            console.log('✗ Should have rejected this login!');
        }
    } catch (error) {
        console.error('✗ Error:', error.message);
    }
}

async function testSignup() {
    console.log('\n=== Testing Customer Signup ===');
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Customer',
                email: `test.customer.${Date.now()}@example.com`,
                password: 'password123',
                is_admin: false
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.success) {
            console.log('✓ Customer signup successful!');
        } else {
            console.log('✗ Customer signup failed:', data.message);
        }
    } catch (error) {
        console.error('✗ Error:', error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('Starting authentication tests...');
    console.log('Make sure your backend server is running on', API_BASE_URL);
    
    await testCustomerLogin();
    await testAdminLogin();
    await testWrongRoleLogin();
    await testSignup();
    
    console.log('\n=== Tests Complete ===\n');
}

runTests();
