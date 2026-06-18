import { useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";

function AskAI() {

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {

    if (!question.trim()) {

      alert("Please enter a question");

      return;

    }

    setLoading(true);

    setAnswer("");

    try {

      const res = await api.get(

        "/notes/ask",

        {

          params: {

            question

          }

        }

      );

      setAnswer(

        res.data.answer

      );

    }

    catch (err) {

      console.log(err);

      alert(

        "Something went wrong"

      );

    }

    setLoading(false);

  };

  return (

    <div className="page">

      <Navbar />

      <div className="card">

        <h1>

          Ask AI

        </h1>

        <textarea

          rows="4"

          placeholder="Ask a question from your uploaded study material..."

          value={question}

          onChange={(e)=>

            setQuestion(

              e.target.value

            )

          }

        />

        <br /><br />

        <button

          onClick={handleAsk}

          disabled={loading}

        >

          {

            loading

            ?

            "Thinking..."

            :

            "Ask"

          }

        </button>

        <br /><br />

        {

          answer

          &&

          (

            <div>

              <h3>

                Answer

              </h3>

              <p>

                {answer}

              </p>

            </div>

          )

        }

      </div>

    </div>

  );

}

export default AskAI;