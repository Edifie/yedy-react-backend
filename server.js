const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;

const pagesRoutes = require("./routes/pages-route");

const app = express();

app.use(bodyParser.json());

app.use("/api/pages", pagesRoutes); // => /api/pages/...

// error handling middleware function
app.use((error, req, res, next) => {
  // if any middleware above it fails, it will return the error handling
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500); //internal server error
  res.json({ message: error.message || "An unknown error occured!" });
});

//server -> localhost:8080
app.listen(port, function () {
  console.log("Server --> Server is running on port " + port);
});
