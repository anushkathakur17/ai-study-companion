import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes/");
      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>

      <Navbar />

      <h1>Dashboard</h1>

      <h3>My Notes</h3>

      {notes.length === 0 ? (
        <p>No notes uploaded yet</p>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <h4>{note.title}</h4>

            <p>
              {note.content
                ? note.content.substring(0, 200)
                : "No content"}
              ...
            </p>
          </div>
        ))
      )}

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

export default Dashboard;