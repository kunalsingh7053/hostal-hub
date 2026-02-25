const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      msg: "No token in cookie"
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