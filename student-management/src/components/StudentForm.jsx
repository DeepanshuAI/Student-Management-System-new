import { useState } from "react";

function StudentForm({ addStudent }) {

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !age || !course) return;

    const newStudent = {
      id: Date.now(),
      name,
      age,
      course,
    };

    addStudent(newStudent);

    setName("");
    setAge("");
    setCourse("");
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2>Add Student</h2>

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

      <button type="submit">Add Student</button>

    </form>
  );
}

export default StudentForm;