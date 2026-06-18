import { useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";

function UploadNotes() {

  const [file, setFile] = useState(null);

  const [text, setText] = useState("");

  const [message, setMessage] = useState("");

  const handleUpload = async () => {

    if (!file) {

      alert(

        "Please select a PDF first"

      );

      return;

    }

    const formData = new FormData();

    formData.append(

      "file",

      file

    );

    try {

      const res = await api.post(

        "/notes/upload",

        formData

      );

      setMessage(

        res.data.message

      );

      setText(

        res.data.text

      );

    }

    catch (err) {

      console.log(

        err

      );

      alert(

        "Upload failed"

      );

    }

  };

  return (

    <div className="page">

      <Navbar />

      <div className="card">

        <h1>

          Upload Notes

        </h1>

        <input

          type="file"

          accept=".pdf"

          onChange={(e)=>

            setFile(

              e.target.files[0]

            )

          }

        />

        <br /><br />

        {

          file

          &&

          (

            <p>

              Selected:

              {" "}

              {file.name}

            </p>

          )

        }

        <button

          onClick={handleUpload}

        >

          Upload

        </button>

        <br /><br />

        {

          message

          &&

          (

            <p className="success">

              {message}

            </p>

          )

        }

        {

          text

          &&

          (

            <div>

              <h3>

                Extracted Notes

              </h3>

              <textarea

                rows="15"

                value={text}

                readOnly

              />

            </div>

          )

        }

      </div>

    </div>

  );

}

export default UploadNotes;