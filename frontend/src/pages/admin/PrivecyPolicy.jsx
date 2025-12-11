import { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";

const PolicyEditor = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 400,
      placeholder: placeholder || "Start typing...",

      // Auto-resize image on paste
      events: {
        afterInsertImage: function (img) {
          img.style.width = "300px";
          img.style.height = "auto";
        },
      },
    }),
    [placeholder]
  );

  const savePolicy = async () => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3001/api/privacy-policy", {
        content,
      });

      console.log("Saved:", res.data);
      alert("Privacy Policy Saved Successfully!");

    } catch (error) {
      console.error(error);
      alert("Failed to save policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Privacy Policy Editor</h2>

      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onChange={() => {}}
        onBlur={(newContent) => setContent(newContent)}
      />

      <button
        onClick={savePolicy}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Policy"}
      </button>
    </div>
  );
};

export default PolicyEditor;
