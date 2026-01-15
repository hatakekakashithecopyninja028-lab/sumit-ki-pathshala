import express from "express";

import dotenv from "dotenv"
import connectDB from "../backend/db/db.js";
dotenv.config();
connectDB()
const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("babuu");
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});



//KfCyzoSp8PCAvj5V

//hatakekakashithecopyninja028_db_user