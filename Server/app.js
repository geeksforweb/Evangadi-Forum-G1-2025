require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5500;

// Routes
const userRouter = require("./routes/userRoute");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
