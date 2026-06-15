import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };

  return (

    <div>

      <Navbar />

      <h1>Dashboard</h1>

      <h3>My Notes</h3>

      <p>No notes uploaded yet</p>

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>

  );
}

export default Dashboard;