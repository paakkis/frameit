import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";

const STORAGE_KEY = "badgeImageUrl";

const App = () => {
    const [url, setUrl] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        chrome.storage.sync.get([STORAGE_KEY], (result) => {
            if (result[STORAGE_KEY]) {
                setUrl(result[STORAGE_KEY]);
            }
        });
    }, []);

    const onSave = () => {
        chrome.storage.sync.set({ [STORAGE_KEY]: url.trim() }, () => {
            setSaved(true);
            setTimeout(() => setSaved(false), 1200);
        });
    };

  return (
    <div className="popup">
      <h1>FrameIt</h1>
            <label className="label" htmlFor="badge-url">
                Badge image URL
            </label>
            <input
                id="badge-url"
                className="input"
                type="url"
                placeholder="https://example.com/badge.png"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
            />
            <button className="button" type="button" onClick={onSave}>
                Save
            </button>
      {saved ? <p className="status">Saved. Refresh Faceit.</p> : null}
      <p className="hint">Default badge is used when empty.</p>
    </div>
  );
};

const root = document.getElementById("root");

if (root) {
    createRoot(root).render(<App />);
}
