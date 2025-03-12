import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/checkboxes";

const App = () => {
  const [checkboxes, setCheckboxes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [newWording, setNewWording] = useState("");

  useEffect(() => {
    fetchCheckboxes();
  }, []);

  const fetchCheckboxes = () => {
    axios.get(API_URL)
      .then(res => setCheckboxes(res.data))
      .catch(err => console.error("Error fetching checkboxes:", err));
  };

  const handleToggle = (label) => {
    setSelected(prev => {
        const formattedLabel = label.startsWith("#") ? label : `${label}`;
        return prev.includes(formattedLabel)
            ? prev.filter(item => item !== formattedLabel)
            : [...prev, formattedLabel];
    });
};

  const addWording = () => {
    if (!newWording.trim()) return;
    axios.post(API_URL, { label: newWording })
      .then(() => {
        setNewWording("");
        fetchCheckboxes();
      })
      .catch(err => console.error("Error adding wording:", err));
  };

  const deleteCheckbox = (id, label) => {
    axios.delete(`${API_URL}/${id}`)
        .then(() => {
            fetchCheckboxes();
            setSelected(prev => prev.filter(item => item !== `${label}`));
        })
        .catch(err => console.error("Error deleting checkbox:", err));
};

  const copyToClipboard = () => {
    const text = selected.map(item => `#${item}`).join("\n");
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard:\n" + text);
  };


  return (
    <div className="container">
      <h2 className="header">SnapTag - Select Your Tags</h2>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter wording..."
          value={newWording}
          onChange={(e) => setNewWording(e.target.value)}
          className="input"
        />
        <button onClick={addWording} className="add-button">Add</button>
      </div>

      <div className="list-container">
        {checkboxes.map((item) => (
          <div key={item.id} className="list-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selected.includes(`${item.label}`)}
                onChange={() => handleToggle(item.label)}
                className="checkbox"
              />
              {item.label}
            </label>
            <button onClick={() => deleteCheckbox(item.id, item.label)} className="delete-button">❌</button>
          </div>
        ))}
      </div>

      <button onClick={copyToClipboard} className="copy-button">
        Copy to Clipboard
      </button>

      <div className="result-container">
        <h3>Final Result:</h3>
        <pre className="result-text">
          {selected.map(item => `#${item}`).join("\n")}
        </pre>
      </div>

    </div>
  );
};

export default App;