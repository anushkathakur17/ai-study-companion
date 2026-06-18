import { Link } from "react-router-dom";

function Navbar() {

  return (

    <nav className="navbar">

      <h2>

        AI Study Companion

      </h2>

      <div>

        <Link to="/dashboard">

          Dashboard

        </Link>

        <Link to="/upload">

          Upload

        </Link>

        <Link to="/ask">

          Ask AI

        </Link>

        <Link to="/flashcards">

          Flashcards

        </Link>

        <Link to="/quiz">

          Quiz

        </Link>

      </div>

    </nav>

  );

}

export default Navbar;