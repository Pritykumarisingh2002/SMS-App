const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.post("/student-login", (req, res) => {
  const { admno, m_phone } = req.body;

  if (!admno || !m_phone) {
    return res.json({
      success: false,
      message: "Admission No and Mobile No required",
    });
  }

  const sql = `
    select studmast.admno,studmast.name,studmast.section,studmast.m_phone,studmast.dob,clmast.CLCAPTION from studmast left join clmast on studmast.clcode=clmast.clcode
    WHERE admno = ?
    AND m_phone = ?
    LIMIT 1
  `;

  db.query(sql, [admno, m_phone], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    if (result.length === 0) {
      return res.json({
        success: false,
        message: "Invalid Admission No or Mobile No",
      });
    }

    res.json({
      success: true,
      student: result[0],
    });
  });
});

app.get("/student-fee", async (req, res) => {
  try {
    const admno = req.query.admno;

    const [student] = await db.promise().query(
      `
      SELECT
        studid,
        admno,
        clcode,
        fee_prof_code,
        doa,
        noterms
      FROM studmast
      WHERE admno = ?
      `,
      [admno]
    );

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const s = student[0];

    const terms = 1;

    let filter = "";

    if (s.noterms > 0) {
      filter = " AND AC_MODE='T'";
    } else if (s.noterms === 0) {
      filter = " AND AC_MODE<>'I'";
    }

    if (
      s.noterms < 1 &&
      (s.clcode === 1 || s.clcode === 2)
    ) {
      filter +=
        " OR (f.AC_NO=9 AND FEE_PROF_CODE=1)";
    }

    const [fees] = await db.promise().query(
      `
      SELECT
          f.AC_NO,
          a.AC_NAME,
          IF(AC_MODE='T', fee * ?, fee) AS fee
      FROM fee_matrix f
      INNER JOIN ac_master a
          ON f.AC_NO = a.AC_NO
      WHERE FEE_PROF_CODE = ?
      AND a.AC_MANDATORY = 1
      ${filter}
      `,
      [terms, s.fee_prof_code]
    );

    const [adhoc] = await db.promise().query(
      `
      SELECT
          f.AC_NO,
          a.AC_NAME,
          amount AS fee
      FROM adhocfee f
      INNER JOIN ac_master a
          ON f.AC_NO = a.AC_NO
      WHERE studid = ?
      AND paid = 0
      `,
      [s.studid]
    );

    const allFees = [...fees, ...adhoc];

    const totalFee = allFees.reduce(
      (sum, item) => sum + Number(item.fee),
      0
    );

    res.json({
      success: true,
      student: s,
      fees: allFees,
      totalFee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});