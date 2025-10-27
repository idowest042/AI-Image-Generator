// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import user from "../model/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = await user.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ msg: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({ msg: "Invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }
};
