import { useState, useEffect } from "react";
import StudentList from "./components/StudentList";

function App() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");
    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [editStudent, setEditStudent] = useState(null);

  // Save students to LocalStorage
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const addStudent = (e) => {
    e.preventDefault();
    
    console.log("Adding student:", name, age, course);

    if (editStudent) {
      const updatedStudents = students.map((student) =>
        student.id === editStudent.id
          ? { ...student, name, age, course }
          : student
      );

      setStudents(updatedStudents);
      setEditStudent(null);
    } else {
      const newStudent = {
        id: Date.now(),
        name,
        age,
        course,
      };

      setStudents([...students, newStudent]);
    }

    setName("");
    setAge("");
    setCourse("");
  };

  const deleteStudent = (id) => {
    const filteredStudents = students.filter((student) => student.id !== id);
    setStudents(filteredStudents);
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setName(student.name);
    setAge(student.age);
    setCourse(student.course);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Management System</h1>

      <form onSubmit={addStudent}>
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <button type="submit">
          {editStudent ? "Update Student" : "Add Student"}
        </button>
      </form>

      <StudentList
        students={students}
        deleteStudent={deleteStudent}
        handleEdit={handleEdit}
      />
    </div>
  );
}

export default App;