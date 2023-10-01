// ds.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/", (req, res) => {
  const pageNumber = req.query.page || 1; // Get the page number from query parameters
  const url = `https://dramacool.pa/recently-added?page=${pageNumber}`;

  axios
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const episodeContainer = $(
        ".tab-content.left-tab-1.selected ul.list-episode-item"
      );
      const episodeList = episodeContainer.find("li");

      const scrapedData = [];

      episodeList.each((index, element) => {
        const imgURL = $(element).find("img.lazy").attr("data-original");
        const postLink = $(element).find("a.img").attr("href");
        const typeContent = $(element).find("span.type").text();
        const title = $(element).find(".img h3.title").text();
        const time = $(element).find(".img span.time").text();
        const episodeNumber = $(element).find(".img span.ep").text();

        scrapedData.push({
          imgURL,
          postLink,
          typeContent,
          title,
          time,
          episodeNumber,
        });
      });
      res.json(scrapedData);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

module.exports = router;
