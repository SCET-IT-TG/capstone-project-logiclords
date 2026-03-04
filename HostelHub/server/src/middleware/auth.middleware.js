import jwt from "jsonwebtoken";

/*
========================================
🔐 PROTECT ROUTE (LOGIN REQUIRED)
========================================
*/
export const protect = (req, res, next) => {
  let token = null;

  // ✅ 1. Check Cookie Token
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // ✅ 2. Check Bearer Token (Postman / Axios)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ❌ No Token
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded should contain id + role
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/*
========================================
👑 ROLE AUTHORIZATION
========================================
Usage:
authorize("admin")
authorize("admin", "warden")
*/
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };