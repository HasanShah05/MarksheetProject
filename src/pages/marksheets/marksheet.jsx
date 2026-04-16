import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@mantine/core";

function Marksheets() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});
  const [grades, setGrades] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5001/students")
      .then(res => res.json())
      .then(studentsData => {
        setStudents(studentsData);
  
        fetch("http://localhost:5001/subjects")
          .then(res => res.json())
          .then(subjectsData => {
            setSubjects(subjectsData);
  
            fetch("http://localhost:5001/marks")
              .then(res => res.json())
              .then(marksData => {
  
                const formattedMarks = {
                  unit1: {},
                  unit2: {},
                  term1: {},
                  term2: {},
                };
  
                marksData.forEach((row) => {
                  const index = studentsData.findIndex(
                    (s) => s.roll_no === row.roll_no
                  );
  
                  if (index === -1) return;
  
                  if (!formattedMarks.unit1[index]) formattedMarks.unit1[index] = {};
                  if (!formattedMarks.unit2[index]) formattedMarks.unit2[index] = {};
                  if (!formattedMarks.term1[index]) formattedMarks.term1[index] = {};
                  if (!formattedMarks.term2[index]) formattedMarks.term2[index] = {};
  
                  formattedMarks.unit1[index][row.subject] = row.unit1_marks;
                  formattedMarks.unit2[index][row.subject] = row.unit2_marks;
                  formattedMarks.term1[index][row.subject] = row.term1_marks;
                  formattedMarks.term2[index][row.subject] = row.term2_marks;
                });
  
                setMarks(formattedMarks);
              });
          });
      });
  }, []);

  const student = students[selectedIndex];

  const getMarks = (exam, subjectName) => {
    return marks?.[exam]?.[selectedIndex]?.[subjectName] || 0;
  };

  const getSubjectTotal = (subjectName) => {
    return (
      getMarks("unit1", subjectName) +
      getMarks("unit2", subjectName) +
      getMarks("term1", subjectName) +
      getMarks("term2", subjectName)
    );
  };

  const getGrandTotal = () => {
    return subjects.reduce((total, sub) => {
      return total + getSubjectTotal(sub.name);
    }, 0);
  };

  const getPercentage = () => {
    const total = getGrandTotal();
    const max = subjects.length * 220;
    return ((total / max) * 100).toFixed(1);
  };

  const isSubjectPass = (sub) => {
    const u1 = getMarks("unit1", sub.name);
    const u2 = getMarks("unit2", sub.name);
    const t1 = getMarks("term1", sub.name);
    const t2 = getMarks("term2", sub.name);

    return (
      u1 >= sub.unit1_pass &&
      u2 >= sub.unit2_pass &&
      t1 >= sub.term1_pass &&
      t2 >= sub.term2_pass
    );
  };

  const getResult = () => {
    const allPass = subjects.every((sub) => isSubjectPass(sub));
    return allPass ? "PASS" : "FAIL";
  };

  const getGrade = () => {
    const allPass = subjects.every((sub) => isSubjectPass(sub));

    if (!allPass) return "Failed";

    const p = getPercentage();

    const sorted = [...grades].sort((a, b) => b.min - a.min);

    for (let g of sorted) {
      if (p >= g.min) return g.name;
    }

    return "N/A";
  };

  if (!student) return <p>No Data!</p>;

  return (
    <div className="marksheet-container">
      <h2>Marksheet</h2>
      <div>
        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
        >
          {students.map((std, index) => (
            <option value={index} key={index}>
              {std.name} (Roll NO {index + 1})
            </option>
          ))}
        </select>
        <Button variant="filled" color="blue" radius="md" onClick={window.print}>
          Print Marksheet
        </Button>
      </div>
      <br />
      <div className="marksheet-card">
        <h1>Imatix College Of Business</h1>
        <p>Consolidated Marksheet - Academic year 2025-2026</p>
        <div className="student-info">
          <div>
            <p>
              <b>Student Name:</b> {student.name}
            </p>
            <p>
              <b>Roll Number:</b> {selectedIndex + 1}
            </p>
          </div>
          <div>
            <p>
              <b>Class:</b> {student.class}
            </p>
            <p>
              <b>Report Type:</b> Consolidated
            </p>
          </div>
        </div>
        <table className="mark-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Unit 1</th>
              <th>Unit 2</th>
              <th>Term 1</th>
              <th>Term 2</th>
              <th>Total</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub, index) => {
              const total = getSubjectTotal(sub.name);
              const pass = isSubjectPass(sub);

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{sub.name}</td>
                  <td>{getMarks("unit1", sub.name)}</td>
                  <td>{getMarks("unit2", sub.name)}</td>
                  <td>{getMarks("term1", sub.name)}</td>
                  <td>{getMarks("term2", sub.name)}</td>
                  <td>
                    <b>{total}</b>
                  </td>
                  <td
                    style={{
                      backgroundColor: pass ? "lightgreen" : "#f07373",
                      color: pass ? "green" : "black",
                      textAlign: "center",
                      borderRadius: "20px",
                    }}
                  >
                    {pass ? "Pass" : "Fail"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="summary">
          <div>
            <h2>{getGrandTotal()}</h2>
            <p>Obtainded (out of {subjects.length * 220})</p>
          </div>
          <div>
            <h2>{getPercentage()}%</h2>
            <p>Percentage</p>
          </div>
          <div>
            <h2 style={{ color: getGrade() === "Failed" ? "red" : "blue" }}>
              {getGrade()}
            </h2>
            <p>Grade</p>
          </div>
          <div>
            <h2 style={{ color: getResult() === "PASS" ? "green" : "red" }}>
              {getResult()}
            </h2>
            <p>Overall Result</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marksheets;
