const { verify } = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey_postarea_2026_modern";

const extractToken = (req) => {
  const authHeader = req.header("authorization") || req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return req.header("accessToken") || req.header("accesstoken");
};

const validateToken = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: "Access denied. User not logged in." });
  }

  try {
    const validToken = verify(token, JWT_SECRET);
    req.user = validToken;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

const optionalToken = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return next();
  }
  try {
    const validToken = verify(token, JWT_SECRET);
    req.user = validToken;
  } catch (err) {
    // Ignore invalid token in optional check
  }
  return next();
};

module.exports = { validateToken, optionalToken };
