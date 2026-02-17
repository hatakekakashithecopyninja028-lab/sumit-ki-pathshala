import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import authroute from "./routes/auth.route.js";
import enquiryroute from "./routes/enquiry.route.js";
import connectDB from "./db/db.js";
import enrolledcourse from "./routes/enrolledcourse.route.js"
dotenv.config();
connectDB()
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json())
app.use(cors());
app.use("/api/enquiry", enquiryroute)
app.use("/api/auth", authroute)
app.use("/api/enrolled", enrolledcourse)

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});



//KfCyzoSp8PCAvj5V

//hatakekakashithecopyninja028_db_user