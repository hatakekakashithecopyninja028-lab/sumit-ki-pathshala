import jwt from "jsonwebtoken";
import User from "../modals/auth.modals.js";

const protect = async (req, res, next) => {
  try {
    // 1️⃣ Token nikaalo header se
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        message: "Not authorized, token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ User nikaalo DB se
    req.user = await User.findById(decoded.id).select("-password");

    next(); // ✅ allowed

  } catch (error) {
    res.status(401).json({
      message: "Not authorized, token failed"
    });
  }
};

export default protect;
