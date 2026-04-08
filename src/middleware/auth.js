import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // yaha se .env file ke variables ko load karenge

export const authMiddleware = (req, res, next) => { // ye middleware har protected route pe use hoga, yaha pe token verify karenge
  try {
    const token = req.headers.authorization; // client se token ko header me bhejna hoga, usually "Bearer <token>" format me

    if (!token) { // agar token nahi mila to unauthorized response bhejenge
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)  // token ko verify karenge, agar valid hai to decoded payload milega, agar invalid hai to error throw hoga

    req.user = decoded; // agar token valid hai to decoded payload ko req.user me store karenge, jisse aage ke route handlers me use kar sakte hai

    next(); // loop chaltha rhyega 
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};