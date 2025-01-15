const express = require("express");
const router = express.Router();
const songsController = require("../controllers/songsController");

router.post("/", songsController.createSong);

router.get("/", songsController.getAllSongs);

router.get("/:id", songsController.getSongById);

router.put("/:id", songsController.updateSong);

router.delete("/:id", songsController.deleteSong);

module.exports = router;
