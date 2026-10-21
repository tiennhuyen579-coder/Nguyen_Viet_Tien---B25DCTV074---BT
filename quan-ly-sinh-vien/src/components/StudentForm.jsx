import { useState } from "react";

const EMPTY = { name: "", email: "", major: "CNTT", gpa: "" };

function validate({ name, email, gpa }) {
  const errors = {};
  if (name.trim().length < 3) errors.name = "Họ tên tối thiểu 3 ký tự";
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Email không hợp lệ";
  if (gpa === "" || gpa < 0 || gpa > 4) errors.gpa = "GPA phải từ 0 đến 4";
  return errors;
}

export default function StudentForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    try {
      await onAdd({ ...form, gpa: Number(form.gpa) });
      setForm(EMPTY);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2>Thêm sinh viên</h2>
      <label>
        Họ tên
        <input name="name" value={form.name} onChange={handleChange} />
        <p className="error">{errors.name}</p>
      </label>
      <label>
        Email
        <input name="email" value={form.email} onChange={handleChange} />
        <p className="error">{errors.email}</p>
      </label>
      <label>
        Ngành
        <select name="major" value={form.major} onChange={handleChange}>
          <option>CNTT</option>
          <option>ATTT</option>
          <option>ĐTVT</option>
          <option>AIOT</option>
        </select>
      </label>
      <label>
        GPA (0–4)
        <input name="gpa" type="number" step="0.01" value={form.gpa} onChange={handleChange} />
        <p className="error">{errors.gpa}</p>
      </label>
      <p className="error">{errors.submit}</p>
      <button className="btn">Thêm</button>
    </form>
  );
}
