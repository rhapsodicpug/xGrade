import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [student, setStudent] = useState({
    id: "",
    name: "",
    roll: "",
    class: "",
    section: "",
    dob: "",
    subjects: [],
  });

  const [subject, setSubject] = useState({ name: "", marks: "" });
  const [searchName, setSearchName] = useState("");
  const [popupStudent, setPopupStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (e) => {
    setSubject({ ...subject, [e.target.name]: e.target.value });
  };

  const addSubject = () => {
    const parsedMarks = parseInt(subject.marks, 10);
    if (
      subject.name.trim() &&
      !isNaN(parsedMarks) &&
      !student.subjects.some(
        (s) => s.name.toLowerCase() === subject.name.toLowerCase()
      )
    ) {
      setStudent({
        ...student,
        subjects: [...student.subjects, { name: subject.name, marks: parsedMarks }],
      });
      setSubject({ name: "", marks: "" });
    } else {
      alert("Subject already added or invalid input.");
    }
  };

  const submitStudent = async () => {
    if (!student.name || !student.roll || !student.dob) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (editing) {
        await axios.put(`http://127.0.0.1:8080/update_student/${student.id}`, student);
        alert("Student updated successfully!");
      } else {
        const response = await axios.post("http://127.0.0.1:8080/add_student", {
          ...student,
          id: "",
        });
        const newId = response.data;
        setStudent((prev) => ({ ...prev, id: newId }));
        alert("Student submitted successfully!");
      }

      fetchStudents();
      resetForm();
    } catch (err) {
      alert("Failed to submit student data.");
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/get_students");
      setStudents(response.data);
    } catch (err) {
      console.error("Failed to fetch students.", err);
    }
  };

  const deleteStudent = async (id) => {
    if (!id) {
      console.error("No ID provided for deletion");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8080/delete_student/${id}`);
      fetchStudents();
    } catch (err) {
      alert("Failed to delete student.");
      console.error(err);
    }
  };

  const editStudent = (studentData) => {
    setStudent({ ...studentData }); // Deep clone to avoid accidental mutation
    setEditing(true);
  };

  const resetForm = () => {
    setStudent({
      id: "",
      name: "",
      roll: "",
      class: "",
      section: "",
      dob: "",
      subjects: [],
    });
    setEditing(false);
  };

  const searchStudent = () => {
    const found = students.find(
      (s) => s.name.toLowerCase() === searchName.toLowerCase()
    );
    if (found) {
      setPopupStudent(found);
    } else {
      alert("Student not found");
      setPopupStudent(null);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="main-wrapper">
      <h2 className="app-title">xGrade</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button onClick={searchStudent}>🔍 Search</button>
      </div>

      {/* Student Form */}
      <div className="input-grid">
        <input type="text" name="name" placeholder="Name" value={student.name} onChange={handleChange} />
        <input type="text" name="roll" placeholder="Roll No" value={student.roll} onChange={handleChange} />
        <input type="text" name="class" placeholder="Class" value={student.class} onChange={handleChange} />
        <input type="text" name="section" placeholder="Section" value={student.section} onChange={handleChange} />
        <input type="date" name="dob" value={student.dob} onChange={handleChange} />
      </div>

      <div className="subjects-section">
        <h4>Add Subjects</h4>
        <div className="subject-row">
          <input type="text" name="name" placeholder="Subject Name" value={subject.name} onChange={handleSubjectChange} />
          <input type="number" name="marks" placeholder="Marks" value={subject.marks} onChange={handleSubjectChange} />
          <button onClick={addSubject}>➕ Add</button>
        </div>

        {student.subjects.length > 0 && (
          <ul>
            {student.subjects.map((sub, idx) => (
              <li key={idx}>{sub.name}: {sub.marks}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="button-group">
        <button onClick={submitStudent}>
          {editing ? "✏️ Update Student" : " Submit"}
        </button>
        {editing && <button onClick={resetForm}> Cancel Edit</button>}
      </div>

      {/* Student List */}
      <div className="students-list">
        <h3> All Students</h3>
        {students.map((s) => (
          <div key={s.id} className="student-card">
            <p><strong>{s.name}</strong> ({s.roll})</p>
            <button onClick={() => editStudent(s)}> Edit</button>
            <button onClick={() => deleteStudent(s.id)}> Delete</button>
          </div>
        ))}
      </div>

      {/* Popup summary */}
      {popupStudent && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>🎓 Student Summary</h3>
            <p><strong>Name:</strong> {popupStudent.name}</p>
            <p><strong>Roll:</strong> {popupStudent.roll}</p>
            <p><strong>Class:</strong> {popupStudent.class}</p>
            <p><strong>Section:</strong> {popupStudent.section}</p>
            <p><strong>DOB:</strong> {popupStudent.dob}</p>
            <h4> Subjects</h4>
            <ul>
              {popupStudent.subjects.map((sub, idx) => (
                <li key={idx}>{sub.name}: {sub.marks}</li>
              ))}
            </ul>
            <button onClick={() => setPopupStudent(null)}> Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
