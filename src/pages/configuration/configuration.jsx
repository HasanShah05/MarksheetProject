import React from "react";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

function Configuration() {
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);

  const [subjectName, setSubjectName] = useState("");
  const [u1Max, setU1Max] = useState("");
  const [u1Pass, setU1Pass] = useState("");
  const [u2Max, setU2Max] = useState("");
  const [u2Pass, setU2Pass] = useState("");
  const [t1Max, setT1Max] = useState("");
  const [t1Pass, setT1Pass] = useState("");
  const [t2Max, setT2Max] = useState("");
  const [t2Pass, setT2Pass] = useState("");

  const defaultGrades = [
    { name: "Failed", min: 0, label: "Below 35%", class: "badge-failed" },
    {
      name: "Second Class",
      min: 35,
      label: "35% and above",
      class: "badge-second",
    },
    {
      name: "First Class",
      min: 60,
      label: "60% and above",
      class: "badge-first",
    },
    { name: "Merit", min: 85, label: "85% and above", class: "badge-merit" },
  ];

  useEffect(() => {
    const savedData = localStorage.getItem("subjects");
    if (savedData) {
      setSubjects(JSON.parse(savedData));
    }

    const savedGrades = localStorage.getItem("grades");
    if (savedGrades) {
      setGrades(JSON.parse(savedGrades));
    } else {
      localStorage.setItem("grades", JSON.stringify(defaultGrades));
      setGrades(defaultGrades);
    }
  }, []);

  const handleAddSubject = () => {
    if (!subjectName) return;

    const newSubject = {
      name: subjectName,
      unit1Max: u1Max,
      unit1Pass: u1Pass,
      unit2Max: u2Max,
      unit2Pass: u2Pass,
      term1Max: t1Max,
      term1Pass: t1Pass,
      term2Max: t2Max,
      term2Pass: t2Pass,
    };

    const updatedArray = [...subjects, newSubject];
    setSubjects(updatedArray);

    localStorage.setItem("subjects", JSON.stringify(updatedArray, null, 2));

    setSubjectName("");
    setU1Max("");
    setU1Pass("");
    setU2Max("");
    setU2Pass("");
    setT1Max("");
    setT1Pass("");
    setT2Max("");
    setT2Pass("");
  };

  const handleSubjectDelete = (indexToDelete) => {
    const updatedSubjects = subjects.filter((_, index) => index !== indexToDelete)

    setSubjects(updatedSubjects)
    localStorage.setItem("subjects", JSON.stringify(updatedSubjects))
  }

  return (
    <div className="config-cointainer">
      <h2>Subjects And Marks Configuration</h2>
      <table className="config-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Subjects</th>
            <th colSpan={2}>Unit 1</th>
            <th colSpan={2}>Unit 2</th>
            <th colSpan={2}>Term 1</th>
            <th colSpan={2}>Term 2</th>
            <th>Action</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th>Max</th>
            <th>Pass</th>
            <th>Max</th>
            <th>Pass</th>
            <th>Max</th>
            <th>Pass</th>
            <th>Max</th>
            <th>Pass</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((sub, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{sub.name}</td>
              <td>{sub.unit1Max}</td>
              <td>{sub.unit1Pass}</td>
              <td>{sub.unit2Max}</td>
              <td>{sub.unit2Pass}</td>
              <td>{sub.term1Max}</td>
              <td>{sub.term1Pass}</td>
              <td>{sub.term2Max}</td>
              <td>{sub.term2Pass}</td>
              <td>
                <button onClick={() => handleSubjectDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal opened={opened} onClose={close} size={"auto"} centered>
        <div>
          <h3>Edit / Add Subjects</h3>
          <div className="form-cointainer">
            <div>
              <label>Subject Name</label>
              <input
                type="text"
                name="subject"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>
            <div className="form-marks">
              <div>
                <label>Unit 1 Max</label>
                <input
                  type="number"
                  value={u1Max}
                  onChange={(e) => setU1Max(e.target.value)}
                />
              </div>
              <div>
                <label>Unit 1 Pass</label>
                <input
                  type="number"
                  value={u1Pass}
                  onChange={(e) => setU1Pass(e.target.value)}
                />
              </div>
              <div>
                <label>Unit 2 Max</label>
                <input
                  type="number"
                  value={u2Max}
                  onChange={(e) => setU2Max(e.target.value)}
                />
              </div>
              <div>
                <label>Unit 2 Pass</label>
                <input
                  type="number"
                  value={u2Pass}
                  onChange={(e) => setU2Pass(e.target.value)}
                />
              </div>
              <div>
                <label>Term 1 Max</label>
                <input
                  type="number"
                  value={t1Max}
                  onChange={(e) => setT1Max(e.target.value)}
                />
              </div>
              <div>
                <label>Term 1 Pass</label>
                <input
                  type="number"
                  value={t1Pass}
                  onChange={(e) => setT1Pass(e.target.value)}
                />
              </div>
              <div>
                <label>Term 2 Max</label>
                <input
                  type="number"
                  value={t2Max}
                  onChange={(e) => setT2Max(e.target.value)}
                />
              </div>
              <div>
                <label>Term 2 Pass</label>
                <input
                  type="number"
                  value={t2Pass}
                  onChange={(e) => setT2Pass(e.target.value)}
                />
              </div>
            </div>
            <button onClick={handleAddSubject} >Add Subject</button>
          </div>
        </div>
      </Modal>
      <button onClick={open} style={{backgroundColor:'lavender'}}>Add Subject</button>
      <div className="grades-card">
        <h3>Grade Thresholds</h3>
        <p className="subtext">
          Grade is calculated on overall percentage across all subjects
        </p>

        <table className="grades-table">
          <thead>
            <tr>
              <th>Grade</th>
              <th>Minimum %</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => (
              <tr key={index}>
                <td>
                  <span className={`grade-badge ${grade.class}`}>
                    {grade.name}
                  </span>
                </td>
                <td>{grade.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Configuration;
