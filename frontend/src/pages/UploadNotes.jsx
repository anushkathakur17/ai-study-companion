import { useState } from "react";
import api from "../services/api";

function UploadNotes() {
  const [file, setFile] = useState(null);

  const [text, setText] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF first");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      const res = await api.post(
        "/notes/upload",
        formData
      );

      setText(res.data.text);

    } catch (err) {
      console.log(err);

      alert("Upload failed");
    }
  };

  return (
    <div>

      <h1>Upload Notes</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />

      <br /><br />

      {file && (
        <p>
          Selected: {file.name}
        </p>
      )}

      <button onClick={handleUpload}>
        Upload
      </button>

      <br /><br />

      {text && (
        <div>

          <h3>Extracted Notes</h3>

          <textarea
            rows="15"
            cols="80"
            value={text}
            readOnly
          />

        </div>
      )}

    </div>
  );
}

export default UploadNotes;