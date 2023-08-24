if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const router = require('./routers');
const errorHandler = require("./handlers/errorHandler");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);
app.use(errorHandler);


app.listen(port, () => console.log(`Listening to Port: ${port}`));
module.exports = app;