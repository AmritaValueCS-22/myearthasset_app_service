// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";
import dotenv from "dotenv";
dotenv.config();

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(req.header("Authorization"));
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    const user = await User.findOne({
      _id: decoded.userId,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    console.log(user);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate." });
  }
};

export { authenticateUser };
