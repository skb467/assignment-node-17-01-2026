const jwt = require('jsonwebtoken');

 const AdminAuth= async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.json({ message: "Unauthorized User"})
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.redirect('/login');
  }
}

module.exports = AdminAuth