import StudentCard from "./StudentCard";

function StudentList({ students, deleteStudent, handleEdit }) {
  if (students.length === 0) {
    return <p>No students added yet.</p>;
  }

  return (
    <div>
      {students.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          deleteStudent={deleteStudent}
          handleEdit={handleEdit}
        />
      ))}
    </div>
  );
}

export default StudentList;