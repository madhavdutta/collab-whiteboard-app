import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Get token from header, query, or cookies
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1] || req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      role: user.role,
      subscription: user.subscription
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
