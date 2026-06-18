import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";

function Flashcards() {

  const [notes, setNotes] = useState([]);

  const [selectedNote, setSelectedNote] = useState("");

  const [cards, setCards] = useState("");

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

        "/notes/flashcards",

        {

          params: {

            note_id: selectedNote

          }

        }

      );

      setCards(
        res.data.flashcards
      );

    }

    catch (err) {

      console.log(err);

      alert(
        "Generation failed"
      );

    }

  };

  return (

    <div>

      <Navbar />

      <h1>

        Flashcards

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

        Generate Flashcards

      </button>

      <br /><br />

      <pre>

        {cards}

      </pre>

    </div>

  );

}

export default Flashcards;