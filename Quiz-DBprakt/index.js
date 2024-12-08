import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "123",
  port: 5432,
});

const app = express();
const port = 3000;

let quiz = [];
let totalCorrect = 0;
let currentQuestion = {};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Load quiz questions from the database
async function loadQuiz() {
  try {
    const res = await db.query("SELECT * FROM capitals");
    quiz = res.rows;
    console.log("Quiz loaded successfully:", quiz);
  } catch (err) {
    console.error("Error loading quiz:", err.stack);
  }
}

// Fetch the next random question
async function nextQuestion() {
  if (quiz.length === 0) {
    console.error("Quiz is empty. Cannot fetch next question.");
    return;
  }
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

// GET home page
app.get("/", async (req, res) => {
  if (quiz.length === 0) {
    return res.status(500).send("Quiz not loaded. Please try again later.");
  }
  totalCorrect = 0;
  await nextQuestion();
  console.log("Next question:", currentQuestion);
  res.render("index.ejs", { question: currentQuestion, wasCorrect: null, totalScore: totalCorrect });
});

// POST to submit an answer
app.post("/submit", async (req, res) => {
  if (!currentQuestion || !currentQuestion.capital) {
    return res.status(500).send("Question is missing. Please restart the quiz.");
  }

  const answer = req.body.answer.trim();
  let isCorrect = false;

  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    isCorrect = true;
  }

  await nextQuestion();
  console.log("Next question after submission:", currentQuestion);
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

// Start the server after loading quiz data
loadQuiz().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});