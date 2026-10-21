import { useState } from "react";
import useFetch from "./hooks/useFetch.js";
import { useTheme } from "./context/ThemeContext.jsx";
import StudentForm from "./components/StudentForm.jsx";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const { data: students, setData, loading, error } = useFetch(API);
  const { theme, toggle } = useTheme();
  const [keyword, setKeyword] = useState("");

  const shown = students.filter((s) =>
    s.name.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  const add = async (sv) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sv),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const created = await res.json();
    setData((prev) => [...prev, created]);
  };

  const remove = async (sv) => {
    if (!window.confirm(`Xóa sinh viên "${sv.name}"?`)) return;
    const res = await fetch(`${API}/${sv.id}`, { method: "DELETE" });
    if (res.ok) setData((prev) => prev.filter((s) => s.id !== sv.id));
  };

  return (
    <div className="container">
      <header>
        <h1>Quản lý sinh viên</h1>
        <button className="btn btn-ghost" onClick={toggle}>
          {theme === "light" ? "🌙 Tối" : "☀️ Sáng"}
        </button>
      </header>

      <StudentForm onAdd={add} />

      <section className="card">
        <h2>Danh sách ({shown.length})</h2>
        <input
          placeholder="Tìm theo tên..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {loading && <p>Đang tải...</p>}
        {error && <p className="error">Lỗi: {error}</p>}
        {!loading && !error && shown.length === 0 && <p>Chưa có sinh viên</p>}
        <ul className="list">
          {shown.map((sv) => (
            <li key={sv.id}>
              <span>
                {sv.name} – {sv.major} – GPA {sv.gpa}
              </span>
              <button className="btn btn-danger" onClick={() => remove(sv)}>
                Xóa
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
