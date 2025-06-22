import React from 'react';

const StudentTable = ({ students, onDelete, search }) => {
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const header = ["Name", "Roll", "Class", "DOB", "Section", "Subjects"];
    const rows = filtered.map(s =>
      [
        s.name,
        s.rollNumber,
        s.studentClass,
        s.dob,
        s.section,
        s.subjects.map(sub => `${sub.name}:${sub.marks}`).join("|")
      ].join(",")
    );
    const blob = new Blob([[header.join(",") + "\n" + rows.join("\n")]], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  };

  return (
    <div>
      <h2>All Students</h2>
      <button onClick={exportCSV}>📥 Export CSV</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Class</th>
            <th>DOB</th>
            <th>Section</th>
            <th>Subjects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.rollNumber}</td>
              <td>{s.studentClass}</td>
              <td>{s.dob}</td>
              <td>{s.section}</td>
              <td>
                {s.subjects.map((sub, j) => (
                  <div key={j}>{sub.name}: {sub.marks}</div>
                ))}
              </td>
              <td>
                <button onClick={() => onDelete(i)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
