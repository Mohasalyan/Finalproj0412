const express = require("express");
const testRouter = express.Router();

testRouter.get("/", (req, res) => {
  const html = `
  <html>
    <head>
      <title>Ping Page</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #333; /* Dark background color */
          color: #fff; /* Light text color */
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .container {
          max-width: 90%; /* Adjusted container width */
          padding: 20px;
          background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent white background */
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Darker box shadow */
          text-align: left; /* Left-align text within container */
        }
        h1 {
          color: #fff; /* Light text color */
          margin-top: 0; /* Remove default margin for h1 */
        }
        p {
          color: #ddd; /* Slightly lighter text color */
        }
        pre {
          color: #fff; /* Light text color for code */
          white-space: pre-wrap; /* Allow long lines to wrap */
          overflow-x: auto; /* Add horizontal scrollbar if needed */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Ping Page</h1>
        <p>This is the ping page for our application.</p>
        <p>User Agent: ${req.headers["user-agent"]}</p>
        <p>Request Method: ${req.method}</p>
        <p>Request URL: ${req.originalUrl}</p>
        <p>Request Headers:</p>
        <pre>${JSON.stringify(req.headers, null, 2)}</pre>
      </div>
    </body>
  </html>
`;
  res.send(html);
});

module.exports = testRouter;
