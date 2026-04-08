import React from "react";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

function Student() {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedStudents = localStorage.getItem("students");

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  const handleAddStudent = () => {
  if (!studentName || !studentClass) return;

  const newStudent = {
    name: studentName,
    class: studentClass,
  };

  let updatedStudents;

  if (isEditing) {
    updatedStudents = [...students];
    updatedStudents[editIndex] = newStudent;
  } else {
    updatedStudents = [...students, newStudent];
  }

  setStudents(updatedStudents);
  localStorage.setItem("students", JSON.stringify(updatedStudents));

  setStudentName("");
  setStudentClass("");
  setIsEditing(false);
  setEditIndex(null);

  close();
};

  const handleEditStudent = (index) => {
    const student = students[index];

    setStudentName(student.name);
    setStudentClass(student.class);

    setEditIndex(index);
    setIsEditing(true);

    open();
  };

  const handlDeleteStudent = (indexToDelete) => {
    const updatedStudents = students.filter(
      (_, index) => index !== indexToDelete,
    );
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
  };

  return (
    <div className="student-cointainer">
      <h2>Students</h2>
      <table className="std-table">
        <thead>
          <tr style={{ backgroundColor: "lavender" }}>
            <th>Roll No</th>
            <th>Student Name</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((std, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{std.name}</td>
              <td>{std.class}</td>
              <td>
                <button onClick={() => handlDeleteStudent(index)}>
                  Delete
                </button>{" "}
                /<button onClick={() => handleEditStudent(index)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal opened={opened} onClose={close} title="Add Student" centered>
        <div className="std-form">
          <div>
            <div>
              <label>Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div>
              <label>Class</label>
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="light"
            color="rgba(255, 239, 181, 1)"
            radius="xl"
            onClick={handleAddStudent}
          >
            + Add Student
          </Button>
        </div>
      </Modal>
      <br />
      <Button
        variant="light"
        color="rgba(255, 239, 181, 1)"
        radius="xl"
        onClick={open}
      >
        Add New Student
      </Button>
    </div>
  );
}

export default Student;
