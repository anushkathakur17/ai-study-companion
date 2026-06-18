import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";

function Quiz() {

  const [notes, setNotes] = useState([]);

  const [selectedNote, setSelectedNote] = useState("");

  const [quiz, setQuiz] = useState("");

  useEffect(() => {

    fetchNotes();

  }, []);

  const fetchNotes = async () => {

    try {

      const res = await api.get(
        "/notes/list"
      );

      setNotes(
        res.data
      );

    }

    catch (err) {

      console.log(err);

    }

  };

  const handleGenerate = async () => {

    if (!selectedNote) {

      alert("Please select a PDF");

      return;

    }

    try {

      const res = await api.get(

        "/notes/quiz",

        {

          params: {

            note_id: selectedNote

          }

        }

      );

      setQuiz(
        res.data.quiz
      );

    }

    catch (err) {

      console.log(err);

      alert(
        "Quiz generation failed"
      );

    }

  };

  return (

    <div>

      <Navbar />

      <h1>

        Quiz Generator

      </h1>

      <select

        value={selectedNote}

        onChange={(e)=>

          setSelectedNote(

            e.target.value

          )

        }

      >

        <option value="">

          Select PDF

        </option>

        {

          notes.map(

            (note)=>(

              <option

                key={note.id}

                value={note.id}

              >

                {note.title}

              </option>

            )

          )

        }

      </select>

      <br /><br />

      <button

        onClick={handleGenerate}

      >

        Generate Quiz

      </button>

      <br /><br />

      <pre>

        {quiz}

      </pre>

    </div>

  );

}

export default Quiz;