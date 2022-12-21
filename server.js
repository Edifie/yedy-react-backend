const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')

const port = process.env.PORT || 8080;

const pagesRoutes = require("./routes/pages-route");
const usersRoutes = require("./routes/users-route");
const templateRERoutes = require('./routes/templateRE-route')
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/pages", pagesRoutes); // => /api/pages/...
app.use("/api/users", usersRoutes); // => /api/users/...
app.use("/api/RE", templateRERoutes); // => /api/RE/

// this middleware is only reached if we have some request which didn't get a response in the previous routes
app.use((req, res, next) => {
  throw new HttpError("Could not find this route.", 404);
});

// error handling middleware function
app.use((error, req, res, next) => {
  // if any middleware above it fails, it will return the error handling
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500); //internal server error
  res.json({ message: error.message || "An unknown error occured!" });
});

// connect to database
mongoose
  .connect("mongodb://127.0.0.1:27017/yedy-react")
  .then(() =>
    app.listen(port, function () {
      console.log("Server --> Server is running on port " + port);
    })
  )
  .catch(err => {
    console.log(err)
  });
