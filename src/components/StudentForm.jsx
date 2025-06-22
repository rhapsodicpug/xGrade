import React, { useState } from 'react';

const StudentForm = ({ onAdd, showToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    studentClass: '',
    dob: '',
    section: '',
    subjects: [{ name: '', marks: '' }],
  });

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name.startsWith('subject_')) {
      const subjects = [...formData.subjects];
      subjects[index][name.split('_')[1]] = value;
      setFormData({ ...formData, subjects });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addSubject = () => {
    const existingSubjects = formData.subjects.map(s => s.name.toLowerCase().trim());

    if (existingSubjects.includes('')) {
      showToast("Please fill in the current subject before adding a new one.");
      return;
    }

    const lastSubject = formData.subjects[formData.subjects.length - 1].name.toLowerCase().trim();

    if (existingSubjects.filter(name => name === lastSubject).length > 1) {
      showToast(`Subject "${lastSubject}" is already added!`);
      return;
    }

    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: '', marks: '' }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: '',
      rollNumber: '',
      studentClass: '',
      dob: '',
      section: '',
      subjects: [{ name: '', marks: '' }],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Student</h2>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
      <input name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="Roll Number" required />
      <input name="studentClass" value={formData.studentClass} onChange={handleChange} placeholder="Class" required />
      <input name="dob" type="date" value={formData.dob} onChange={handleChange} required />
      <input name="section" value={formData.section} onChange={handleChange} placeholder="Section" required />

      <h3>Subjects</h3>
      {formData.subjects.map((subject, index) => (
        <div className="subject-row" key={index}>
          <input
            name="subject_name"
            value={subject.name}
            onChange={(e) => handleChange(e, index)}
            placeholder="Subject Name"
            required
          />
          <input
            name="subject_marks"
            value={subject.marks}
            onChange={(e) => handleChange(e, index)}
            placeholder="Marks"
            type="number"
            required
          />
        </div>
      ))}

      <button type="button" onClick={addSubject}>+ Add Subject</button>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default StudentForm;
