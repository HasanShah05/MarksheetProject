import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button} from "@mantine/core";
import { notifications } from '@mantine/notifications';


function EnterMarks() {
  const [showAlert, setShowAlert] = useState(false)
  const [students, setStuddents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});
  const [activeExam, setActiveExam] = useState("unit1");

  useEffect(() => {
    const savedStudents = localStorage.getItem("students");
    const savedSubjects = localStorage.getItem("subjects");
    const savedMarks = localStorage.getItem("marks");

    if (savedStudents) setStuddents(JSON.parse(savedStudents));
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedMarks) setMarks(JSON.parse(savedMarks));
  }, []);

  const handleMarkChange = (studentIndex, subjectName, value) => {
    const updatedMarks = { ...marks };

    if (!updatedMarks[activeExam]) {
      updatedMarks[activeExam] = {};
    }
    if (!updatedMarks[activeExam][studentIndex]) {
      updatedMarks[activeExam][studentIndex] = {};
    }

    updatedMarks[activeExam][studentIndex][subjectName] = Number(value);

    setMarks(updatedMarks);
  };

const handleSaveMarks = () => {
  localStorage.setItem("marks", JSON.stringify(marks));

  notifications.show({
    title: "Marks Saved",
    message: "All marks saved successfully",
    color: "green",
  });
};

  const getPassMarks = (subjects) => {
    if (activeExam === "unit1") return subjects.unit1Pass;
    if (activeExam === "unit2") return subjects.unit2Pass;
    if (activeExam === "term1") return subjects.term1Pass;
    if (activeExam === "term2") return subjects.term2Pass;
  };

  const getMaxMarks = (subjects) => {
    if (activeExam === "unit1") return subjects.unit1Max;
    if (activeExam === "unit2") return subjects.unit2Max;
    if (activeExam === "term1") return subjects.term1Max;
    if (activeExam === "term2") return subjects.term2Max;
  };

  return (
    <div className="marks-cointainer">
      <h2>Enter Marks</h2>

      <div className="exam-selector">
        <button onClick={() => setActiveExam("unit1")}>Unit 1</button>
        <button onClick={() => setActiveExam("unit2")}>Unit 2</button>
        <button onClick={() => setActiveExam("term1")}>term 1</button>
        <button onClick={() => setActiveExam("term2")}>term 2</button>
      </div>

      <div>
        Enter Marks for <b>{activeExam}</b>
      </div>

      <table className="marks-table">
        <thead>
          <tr style={{backgroundColor:"lavender"}}>
            <th>Roll No</th>
            <th>Student Name</th>
            {subjects.map((sub, i) => (
              <th key={i}>
                {sub.name}
                <br />
                <small>max {getMaxMarks(sub)}</small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((std, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{std.name}</td>

              {subjects.map((sub, subIndex) => {
                const value = marks?.[activeExam]?.[index]?.[sub.name] || "";

                const isFail = value !== "" && value < getPassMarks(sub);

                return (
                  <td key={subIndex}>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        handleMarkChange(index, sub.name, e.target.value)
                      }
                      style={{
                        border: isFail ? "2px solid red" : "",
                        borderRadius: "6px",
                        padding: "5px",
                        width: "60px",
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buttons */}
      <div style={{ marginTop: "20px" }}>
        <Button variant="light" color="rgba(255, 239, 181, 1)" radius="xl" onClick={handleSaveMarks}>Save All Marks</Button>
      </div>
    </div>
  );
}

export default EnterMarks;
