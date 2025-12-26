"use client";

import { useState } from "react";
import CustomQuillEditor from "./components/QuillEditor";

export default function Home() {
  const [content, setContent] = useState("");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Quill Editor</h1>
      <CustomQuillEditor
        value={content}
        onChange={setContent}
        editorHeight={400}
      />
    </div>
  );
}
