// ds.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/", (req, res) => {
  const routes = {
    "search": "/api/search?keyword={query}",
    "popular": "/api/popular",
    "recent-movie": "/api/recently-added-movie",
    "recent-series": "/api/recently-added",
  };
  res.json(routes);
});

module.exports = router;
