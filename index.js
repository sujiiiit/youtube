const express = require("express");
const axios = require("axios");
const path = require("path");

//main
const app = express();
const port = 3000;

//api routes
app.use("/api/", require("./api/index.js"));
app.use("/api/recently-added", require("./api/recent-series.js"));
app.use("/api/recently-added-movie", require("./api/recent-movie.js"));
app.use("/api/popular", require("./api/popular.js"));
app.use("/api/search", require("./api/search.js"));

//main routes
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/recently-added"
    );
    const data = response.data;
    res.render("index", { data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
