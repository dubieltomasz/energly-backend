import express from "express";
import "dotenv/config";

const port = process.env.PORT;
const api_url = process.env.API_URL;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Worldaaaa");
});

app.listen(port, () => {
  console.log("Server running on http://localhost:" + port);
});