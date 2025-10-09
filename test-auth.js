const jwt = require('jsonwebtoken');

// Test JWT parsing
const testToken = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';

console.log('Testing JWT functionality...');

// Create a test token (like what would be stored in localStorage)
const testPayload = {
  userId: 'test-user-id',
  role: 'student'
};

const token = jwt.sign(testPayload, testToken, { expiresIn: '1h' });
console.log('Generated test token:', token.substring(0, 50) + '...');

// Decode the token
try {
  const decoded = jwt.verify(token, testToken);
  console.log('Decoded token:', decoded);
} catch (error) {
  console.error('Token verification failed:', error.message);
}

// Test Authorization header format
const authHeader = `Bearer ${token}`;
console.log('Authorization header format:', authHeader.substring(0, 50) + '...');
