module.exports = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ msg: "Admin access only" });
  }
  next();
};
