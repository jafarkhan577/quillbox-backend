const express = require('express'); // Importing Express
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing (optional, but recommended)
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for generating JWT
const dotenv = require('dotenv'); // To load .env variables
dotenv.config(); // Load environment variables

const app = express(); // Creating an instance of the Express server

// Middleware to parse JSON bodies
app.use(express.json());

// Sample in-memory database (you can replace this with PostgreSQL or any database)
const users = [];

//POST contact a user
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  // Your logic to handle contact form submission
  res.status(200).json({ message: 'Message received' });
});

// POST endpoint to register a user
app.post('/register', async (req, res) => {
  const { username, password } = req.body; // Get the username and password from request body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the user already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Hash the password before saving (optional but recommended)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Register the user (you can save to a real database here)
  const newUser = { username, password: hashedPassword };
  users.push(newUser);

  return res.status(201).json({ message: 'User registered successfully', user: { username } });
});

// POST endpoint to log in a user
app.post('/login', async (req, res) => {
  const { username, password } = req.body; // Get the username and password from the request body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Find the user by username (from the users array or database)
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Compare the hashed password with the stored password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Incorrect password' });
  }

  // Login success - return success message
  return res.status(200).json({ message: 'Login successful', user: { username } });
});

// Simple GET route for testing
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Starting the server
const PORT = process.env.PORT || 3002; // Port number (3002 by default)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
