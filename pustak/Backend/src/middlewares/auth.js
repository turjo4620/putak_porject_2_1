const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-auth-secret';

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'লগইন প্রয়োজন' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.userId = payload.sub;
    req.userRole = payload.role;

    if (!req.userId) {
      throw new Error('Token payload missing sub (user id)');
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'সেশনের মেয়াদ শেষ হয়ে গেছে, আবার লগইন করুন' });
  }
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'লগইন প্রয়োজন' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.userId = payload.sub;
    req.userRole = payload.role;

    if (!req.userId) {
      throw new Error('Token payload missing sub (user id)');
    }

    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'অ্যাক্সেস অস্বীকার করা হয়েছে। শুধুমাত্র অ্যাডমিনদের জন্য।' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'সেশনের মেয়াদ শেষ হয়ে গেছে, আবার লগইন করুন' });
  }
}

module.exports = { requireAuth, requireAdmin };
