function StudentCard({ student, deleteStudent, handleEdit }) {
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "6px",
      }}
    >
      <h3>{student.name}</h3>
      <p>Age: {student.age}</p>
      <p>Course: {student.course}</p>

      <button onClick={() => handleEdit(student)}>Edit</button>

      <button
        onClick={() => deleteStudent(student.id)}
        style={{ marginLeft: "10px" }}
      >
        Delete
      </button>
    </div>
  );
}

export default StudentCard;