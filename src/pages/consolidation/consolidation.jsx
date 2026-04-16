import React from "react";
import { useState, useEffect } from "react";

function Consolidation() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});

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
            <td rowSpan="5">{std.roll_no}</td>
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
