require("dotenv").config();
const cors = require("cors");

const express = require("express");
const app = express();

const blogRouter = require("./routes/messagesRouter");

const PORT = process.env.EXPRESS_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", blogRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server is listening on http://localhost:${PORT}`);
});
