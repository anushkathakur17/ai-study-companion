import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";

function Quiz() {

  const [notes, setNotes] = useState([]);

  const [selectedNote, setSelectedNote] = useState("");

  const [quiz, setQuiz] = useState("");

  const [loading, setLoading] = useState(false);

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

      console.log(
        err
      );

    }

  };

  const handleGenerate = async () => {

    if (!selectedNote) {

      alert(
        "Please select a PDF"
      );

      return;

    }

    setLoading(
      true
    );

    setQuiz(
      ""
    );

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

      console.log(
        err
      );

      alert(
        "Quiz generation failed"
      );

    }

    setLoading(
      false
    );

  };

  return (

    <div className="page">

      <Navbar />

      <div className="card">

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

          disabled={loading}

        >

          {

            loading

            ?

            "Generating..."

            :

            "Generate Quiz"

          }

        </button>

        <br /><br />

        {

          quiz

          &&

          (

            <div>

              <h3>

                Generated Quiz

              </h3>

              <pre>

                {quiz}

              </pre>

            </div>

          )

        }

      </div>

    </div>

  );

}

export default Quiz;