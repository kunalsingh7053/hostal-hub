const jwt = require("jsonwebtoken");

const getToken = (req) => {
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
};

const auth = (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      msg: "Authentication token missing"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (err) {
    return res.status(401).json({
      msg: "Invalid token"
    });
  }
};

module.exports = auth;