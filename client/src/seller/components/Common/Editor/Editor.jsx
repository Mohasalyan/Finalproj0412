import { Box } from "@mui/material";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles

function UniEditor({ name, editorHtml, setFieldValue }) {
  return (
    <Box component="div" sx={{ height: "30vh" }}>
      <ReactQuill
        name={name}
        theme="snow" // You can change the theme (snow, bubble, or other themes)
        value={editorHtml}
        onChange={e => setFieldValue(name,e)}
        style={{ height: "100%" }}
      />
    </Box>
  );
}

export default UniEditor;
