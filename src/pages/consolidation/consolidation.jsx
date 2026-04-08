import React from "react";
import { useState, useEffect } from "react";

function Consolidation() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    const savedStudents = localStorage.getItem("students");
    const savedSubjects = localStorage.getItem("subjects");
    const savedMarks = localStorage.getItem("marks");

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedMarks) setMarks(JSON.parse(savedMarks));
  }, []);

  const getMark = (exam, studentIndex, subjectName) => {
    return marks?.[exam]?.[studentIndex]?.[subjectName] || 0;
  };

  const getSubjectTotal = (studentIndex, subjectName) => {
    return (
      getMark("unit1", studentIndex, subjectName) +
      getMark("unit2", studentIndex, subjectName) +
      getMark("term1", studentIndex, subjectName) +
      getMark("term2", studentIndex, subjectName)
    );
  };

  const getGrandTotal = (studentIndex) => {
    return subjects.reduce((total, sub) => {
      return total + getSubjectTotal(studentIndex, sub.name);
    }, 0);
  };

  const getExamTotal = (exam, studentIndex) => {
    return subjects.reduce((total, sub) => {
      return total + getMark(exam, studentIndex, sub.name);
    }, 0);
  };

  return (
    <table className="config-table">
      <thead>
        <tr>
          <th>Roll</th>
          <th>Student</th>
          <th>Breakdown</th>

          {subjects.map((sub, i) => (
            <th key={i}>{sub.name}</th>
          ))}

          <th>Grand Total</th>
        </tr>
      </thead>

      {students.map((std, sIndex) => (
        <tbody key={sIndex}>
          <tr>
            <td rowSpan="5">{sIndex + 1}</td>
            <td rowSpan="5">{std.name}</td>
            <td>Unit 1</td>

            {subjects.map((sub, i) => (
              <td key={i}>{getMark("unit1", sIndex, sub.name)}</td>
            ))}
            <td>{getExamTotal("unit1", sIndex)}</td>
          </tr>

          <tr>
            <td>Unit 2</td>
            {subjects.map((sub, i) => (
              <td key={i}>{getMark("unit2", sIndex, sub.name)}</td>
            ))}
            <td>{getExamTotal("unit2", sIndex)}</td>
          </tr>

          <tr>
            <td>Term 1</td>
            {subjects.map((sub, i) => (
              <td key={i}>{getMark("term1", sIndex, sub.name)}</td>
            ))}
            <td>{getExamTotal("term1", sIndex)}</td>
          </tr>

          <tr>
            <td>Term 2</td>
            {subjects.map((sub, i) => (
              <td key={i}>{getMark("term2", sIndex, sub.name)}</td>
            ))}
            <td>{getExamTotal("term2", sIndex)}</td>
          </tr>

          <tr style={{ background: "#e7f5ff", fontWeight: "bold" }}>
            <td>TOTAL</td>

            {subjects.map((sub, i) => (
              <td key={i}>{getSubjectTotal(sIndex, sub.name)}</td>
            ))}

            <td>{getGrandTotal(sIndex)}</td>
          </tr>
        </tbody>
      ))}
    </table>
  );
}

export default Consolidation;
