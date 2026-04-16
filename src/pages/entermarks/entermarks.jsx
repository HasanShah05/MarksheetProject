import React from "react";
import { SegmentedControl } from "@mantine/core";
import { useState, useEffect } from "react";
import { Modal, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

function EnterMarks() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});
  const [activeExam, setActiveExam] = useState("unit1");


useEffect(() => {
  fetch("http://localhost:5001/students")
    .then(res => res.json())
    .then(data => {
      setStudents(data);
    });

  fetch("http://localhost:5001/subjects")
    .then(res => res.json())
    .then(data => {
      setSubjects(data);
    });

  fetch(`http://localhost:5001/marks/${activeExam}`)
    .then(res => res.json())
    .then(data => {

      const formatted = {};

      data.forEach((row) => {
        if (!formatted[row.roll_no]) {
          formatted[row.roll_no] = {};
        }

        formatted[row.roll_no][row.name] = row[`${activeExam}_marks`];
      });

      setMarks({
        [activeExam]: formatted
      });
    });

}, [activeExam]);

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
      <br />
      <SegmentedControl
      fullWidth
      size="lg"
      radius="xl"
        value={activeExam}
        onChange={setActiveExam}
        data={[
          { label: "Unit 1", value: "unit1" },
          { label: "Unit 2", value: "unit2" },
          { label: "Term 1", value: "term1" },
          { label: "Term 2", value: "term2" },
        ]}
      />
    <br />
      <div>
        Enter Marks for <b>{activeExam}</b>
      </div>

      <table className="marks-table">
        <thead>
          <tr style={{ backgroundColor: "lavender" }}>
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
                const value = marks?.[activeExam]?.[std.roll_no]?.[sub.name] || "";

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
        <Button
          variant="light"
          color="rgba(255, 239, 181, 1)"
          radius="xl"
          onClick={handleSaveMarks}
        >
          Save All Marks
        </Button>
      </div>
    </div>
  );
}

export default EnterMarks;
