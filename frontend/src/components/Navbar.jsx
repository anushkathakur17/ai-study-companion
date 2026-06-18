import { Link } from "react-router-dom";

function Navbar() {

  return (

    <nav>

      <Link to="/dashboard">

        Dashboard

      </Link>

      {" | "}

      <Link to="/upload">

        Upload Notes

      </Link>

      {" | "}

      <Link to="/ask">

        Ask AI

      </Link>

      {" | "}

      <Link to="/flashcards">

      Flashcards

      </Link>

      {" | "}

      <Link to="/quiz">

      Quiz

      </Link>

    </nav>

  );

}

export default Navbar;