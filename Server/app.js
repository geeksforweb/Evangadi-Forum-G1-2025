require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/users", require("./routes/userRoute"));
app.use("/api/questions",authMiddleware, require("./routes/questionRoute"));

app.use("/api/answers", authMiddleware, require("./routes/answerRoute"));


// Test route
app.get("/", (req, res) => {
  res.send("Group-1 2025: Evangadi Forum API is running...");
});



app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
