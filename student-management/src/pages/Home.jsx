import { useState } from "react";
import StudentList from "../components/StudentList";

function Home({ students, setStudents }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [editStudent, setEditStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");

  const addStudent = (e) => {
    e.preventDefault();

    if (editStudent) {
      const updatedStudents = students.map((student) =>
        student.id === editStudent.id
          ? { ...student, name, age, course }
          : student,
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
    const filteredStudents = students.filter((s) => s.id !== id);
    setStudents(filteredStudents);
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setName(student.name);
    setAge(student.age);
    setCourse(student.course);
  };

  const filteredStudents = students
  .filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  )
  .filter((student) =>
    courseFilter === "All" ? true : student.course === courseFilter
  );

  const totalStudents = students.length;

const averageAge =
  students.length > 0
    ? Math.round(
        students.reduce((sum, s) => sum + Number(s.age), 0) / students.length
      )
    : 0;

const courses = [...new Set(students.map((s) => s.course))];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Management System</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">

  <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
    <h2 className="text-lg">Total Students</h2>
    <p className="text-2xl font-bold">{totalStudents}</p>
  </div>

  <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
    <h2 className="text-lg">Average Age</h2>
    <p className="text-2xl font-bold">{averageAge}</p>
  </div>

  <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
    <h2 className="text-lg">Courses</h2>
    <p className="text-2xl font-bold">{courses.length}</p>
  </div>

</div>

      <form onSubmit={addStudent}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <button type="submit">
          {editStudent ? "Update Student" : "Add Student"}
        </button>
      </form>

      <input
        type="text"
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={courseFilter}
        onChange={(e) => setCourseFilter(e.target.value)}
      >
        <option value="All">All Courses</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Physics">Physics</option>
      </select>

      <StudentList
        students={filteredStudents}
        deleteStudent={deleteStudent}
        handleEdit={handleEdit}
      />
    </div>
  );
}

export default Home;
