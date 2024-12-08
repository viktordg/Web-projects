import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";

import path from "path";
import { fileURLToPath } from "url";


// Emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(
    session({
        secret: 'taina', 
        resave: false,            // Prevents session from being saved back to the store if it wasn’t modified
        saveUninitialized: false, // Prevents saving uninitialized sessions
        cookie: {
            secure: false,        // Set to true if using HTTPS
            maxAge: 1000 * 60 * 60 * 24 // Optional: Set cookie expiration (e.g., 1 day)
        }
    })
);

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "1",
  password: "123",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use("/styles", express.static(path.join(__dirname, "public/styles")));

// Redirect '/' to '/login'
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Render the login page
app.get("/login", (req, res) => {
  res.render("login");
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user by username
        const result = await db.query('SELECT * FROM Users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid username or password');
        }

         // Store userId in the session
         req.session.userId = user.id;

        // Successful login - redirect to the home page
        res.redirect('/home');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('An error occurred during login');
    }
});

// Render the register page
app.get("/register", (req, res) => {
    res.render("register");
});

// Handle user registration
app.post("/register", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
  
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match. Please try again.");
    }
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user into the database
      await db.query(
        "INSERT INTO Users (username, email, password) VALUES ($1, $2, $3)",
        [username, email, hashedPassword]
      );
  
      // Redirect to the login page after successful registration
      res.redirect("/login");
    } catch (error) {
      console.error("Error registering user:", error);
  
      if (error.code === "23505") { // PostgreSQL unique constraint violation
        res.status(400).send("Username or email already exists.");
      } else {
        res.status(500).send("An error occurred. Please try again.");
      }
    }
});

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next(); // User is logged in, proceed
    }
    res.redirect('/login'); // Redirect to login page if not logged in
}

app.get('/home', isAuthenticated, async (req, res) => {
    const userId = req.session.userId; // Assuming userId is stored in the session after login

    try {
        // Fetch notes for the logged-in user
        const result = await db.query(
            'SELECT * FROM Notes WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        const notes = result.rows; // Extract notes data

        // Render the home page with notes
        res.render('home', { notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).send('An error occurred while fetching notes.');
    }
});

// Handle logout and redirect to login page
app.get('/logout', (req, res) => {
    res.redirect('/login');
});

app.get('/add-note', (req, res) => {
    res.render('add-note'); // Render a form to add a new note
});

app.post('/add-note', async (req, res) => {
    const { title, author, cover_url, notes } = req.body;
    const userId = req.session.userId;

    console.log(req.body);

    try {
        if (!title || !author || !notes) {
            return res.status(400).send('All fields are required.');
        }

        // Insert note into the database
        await db.query(
            'INSERT INTO Notes (user_id, book_title, book_author, book_cover_url, note_text) VALUES ($1, $2, $3, $4, $5)',
            [userId, title, author, cover_url || null, notes]
        );
        res.redirect('/home');
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).send('An error occurred while adding the note.');
    }
});

app.post('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error terminating session:', err);
            return res.status(500).send('Could not log out. Please try again.');
        }

        // Redirect to the login page after session termination
        res.redirect('/login');
    });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
