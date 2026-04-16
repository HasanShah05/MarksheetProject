const express = require("express")
const {Pool} = require("pg")
const cors = require("cors")

const app = express()

app.use(cors({
    origin:"http://localhost:5173"
}))

app.use(express.json())

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"marksheetdb",
    password:"admin",
    port:"5432"
})

app.get("/", (req, res) => {
    res.send("backend is working")
})

app.get("/students", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM students ORDER BY roll_no"
        )
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).send("Error")
    }
})

app.get("/subjects", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM subjects ORDER BY id"
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).send("error in fetching subjects")
    }
})

app.get("/marks/:exam", async (req, res) => {
  const { exam } = req.params; 

  try {
    const result = await pool.query(
      `SELECT 
        m.roll_no,
        sub.name,
        m.${exam}_marks
       FROM marks m
       JOIN subjects sub ON m.subject_id = sub.id`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching marks");
  }
});

app.get("/marks", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
            m.roll_no,
            s.name AS subject,
            m.unit1_marks,
            m.unit2_marks,
            m.term1_marks,
            m.term2_marks
            FROM marks m 
            JOIN subjects s ON m.subject_id = s.id
            ORDER BY m.roll_no
            `)
            res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).send("error fecthing marks")
    }
})

app.post("/students", async (req, res) => {

    const name = req.body?.name;
    const studentsClass = req.body?.class
    try {
        const result = await pool.query(
            "INSERT INTO students (name, class) VALUES ($1,$2) RETURNING *",
            [name, studentsClass]
        )
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).send("error in adding student")
    }
})

app.post("/subjects", async (req, res) => {
    const {
        name,
        unit1_max,
        unit1_pass,
        unit2_max,
        unit2_pass,
        term1_max,
        term1_pass,
        term2_max,
        term2_pass
    } = req.body

    try {
        const result = await pool.query(
            `INSERT INTO subjects 
            (name, unit1_max, unit1_pass, unit2_max, unit2_pass, term1_max, term1_pass, term2_max, term2_pass)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                name,
                unit1_max,
                unit1_pass,
                unit2_max,
                unit2_pass,
                term1_max,
                term1_pass,
                term2_max,
                term2_pass
            ]
        )
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).send("Error adding subject")        
    }
})

app.delete("/students/:roll_no", async(req, res) => {
    const {roll_no} = req.params


    try {
        await pool.query(
            "DELETE FROM students WHERE roll_no = $1",
            [roll_no]
        )
        res.send("deleted")
    } catch (err) {
        console.error(err)
        res.status(500).send("Error deleting")
    }
})

app.delete("/subjects/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM marks WHERE subject_id = $1", [id]);
    await pool.query("DELETE FROM subjects WHERE id = $1", [id]);

    res.send("Subject deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting subject");
  }
});


app.listen(5001, ()=>{
    console.log("Server running on port 5001");
})