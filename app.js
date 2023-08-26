if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const router = require("./routers");
const multer = require("multer");
const errorHandler = require("./handlers/errorHandler");
const fileStorage = require("./config/multer");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  multer({
    fileFilter: fileStorage.filterImage,
  }).single("avatar")
);

app.use(router);
app.use(errorHandler);

app.listen(port, () => console.log(`Listening to Port: ${port}`));
module.exports = app;
