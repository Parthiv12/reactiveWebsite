const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

app.get("/", (req, res) => {
    console.log("Backend is running!");
    res.send("Backend is running!");
});

// Route to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords from the response
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


// Signup Route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: "User already exists" });

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save User
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  console.log(`User Signed Up: ${username} (${email})`);
  res.json({ message: "User registered successfully!" });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  console.log(`User Logged In: ${user.username} (${user.email})`);
  res.json({ token, user: { username: user.username, email: user.email } });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));