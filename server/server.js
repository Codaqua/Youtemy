import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
const morgan = require("morgan");
require("dotenv").config();

const youtubeRouter = require("./routes/course");

const csrfProtection = csrf({ cookie: true });

const courseRoutes = require("./routes/course");

// create express app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE, {
    // .connect('mongodb://localhost:27017/youtemy', { // it does not work with IPv6
    // .connect('mongodb://127.0.0.1:27017/youtemy', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  // .connect(process.env.DATABASE, {})
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

// apply middlewares
app.use(cors());
app.use(express.json({limit: '5mb'}));
app.use(cookieParser());
app.use(morgan("dev"));


// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


// route
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));


// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

app.use("/api/youtube", youtubeRouter);

app.use(courseRoutes);