import express from "express";
import bcrypt from "bcryptjs";
import { users } from "../data/store.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const router = express.Router();// ye router auth related routes ke liye hoga, isme register, login, forgot password, reset password ke routes honge

// REGISTER
router.post("/register", async (req, res) => {// ye route user registration ke liye hoga, isme email, password, role (optional) send karna hoga, agar role nahi diya to default "attendee" set kar denge
  try {
    const { email, password, role } = req.body;// destructuring req.body se email, password, role ko extract karenge


    // check existing user
    const existingUser = users.find(u => u.email === email);// users array me se check karenge ki email already exist karta hai ya nahi, agar karta hai to error response bhejenge
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });// agar email already exist karta hai to 400 Bad Request response bhejenge, message me "User already exists" denge
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);// password ko hash karenge bcrypt library ka use karke, 10 salt rounds ke sath, hashed password milega

    const newUser = { // naya user object banayenge, isme id, email, hashed password, role (agar diya hai to) hoga
      id: Date.now(),
      email,
      password: hashedPassword,
      role: role || "attendee"
    };

    users.push(newUser);// naya user ko users array me push karenge, isse humare in-memory store me user save ho jayega

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});
dotenv.config();


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});



export default router;