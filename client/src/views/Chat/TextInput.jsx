
// TextInput.jsx
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import { Button, TextField } from "@mui/material";
import "./chat.scss"; 
export const TextInput = () => {
  return (
    <>
      <form className="wrapForm" noValidate autoComplete="off">
        <TextField
          id="standard-text"
          label="Type your message"
          className="wrapText"
        />
        <Button variant="contained" color="primary" className="button">
          <SendIcon />
        </Button>
      </form>
    </>
  );
};
