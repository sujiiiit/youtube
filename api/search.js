// ds.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/", (req, res) => {
  const query = req.query.keyword;
  const page = req.query.page || 1;
  const url = `https://dramacool.pa/search?type=movies&keyword=${query}&page=${page}`;

  axios
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const episodeContainer = $(
        ".tab-content.left-tab-1.selected ul.list-episode-item"
      );
      const episodeList = episodeContainer.find("li");

      const auto_complete_data = [];

      episodeList.each((index, element) => {
        const imgURL = $(element).find("img.lazy").attr("data-original");
        const postLink = $(element).find("a.img").attr("href");
        const typeContent = $(element).find("span.type").text();
        const title = $(element).find(".img h3.title").text();

        auto_complete_data.push({
          imgURL,
          postLink,
          typeContent,
          title,
        });
      });
      res.json(auto_complete_data);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

module.exports = router;
