const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect Database
db.connect((err) => {
  if (err) {
    console.log("Database Connection Error:", err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});


// ================= LOGIN API =================

app.post("/login", (req, res) => {

  const { admno, password } = req.body;

  // Validation
  if (!admno || !password) {
    return res.status(400).json({
      success: false,
      message: "Admission number and password are required",
    });
  }

  const sql = `
    SELECT 
      studid,
      admno,
      name,
      m_phone
    FROM studmast
    WHERE admno = ?
  `;

  db.query(sql, [admno], (err, result) => {

    // Database Error
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err,
      });
    }

    // Student Not Found
    if (result.length === 0) {
      return res.json({
        success: false,
        message: "Invalid Admission Number",
      });
    }

    const student = result[0];

    // Password Check
    // Mobile number is used as password
    if (student.m_phone != password) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        studid: student.studid,
        admno: student.admno,
        name: student.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Success Response
    res.json({
      success: true,
      message: "Login Successful",
      token,
      student: {
        studid: student.studid,
        admno: student.admno,
        name: student.name,
      },
    });

  });

});


// ================= PROFILE API =================

app.get("/profile", (req, res) => {

  const authHeader = req.headers.authorization;

  // No Token
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  // Verify Token
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {

      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      res.json({
        success: true,
        student: decoded,
      });

    }
  );

});


// ================= DEFAULT ROUTE =================

app.get("/", (req, res) => {
  res.send("Server Running Successfully");
});


// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});