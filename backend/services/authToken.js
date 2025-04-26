const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = userInfo;
    next();
  });
};

module.exports = authToken;
