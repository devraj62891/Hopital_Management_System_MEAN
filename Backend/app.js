const express = require("express");
const cors = require("cors");
const doctorRoute = require("./src/routes/doctor");
const patientRoute = require("./src/routes/patient");
const authRoute = require("./src/routes/auth"); 
const cookieParser = require("cookie-parser");

const app = express();


app.use(cors({ 
  origin: "http://localhost:4200", 
  credentials: true, 
  allowedHeaders: ["Content-Type", "Authorization"] 
}));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/doctor", doctorRoute);
app.use("/patient", patientRoute);
app.use("/auth", authRoute); 

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Server is running and MongoDB is connected" });
});

module.exports = app;