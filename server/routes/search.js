// search.js
const router = require("express").Router();

const { Track } = require("../models/track");
const { Playlist } = require("../models/playlist");

const auth = require("../middleware/auth");

// query search
router.get("/", auth, async (req, res) => {
    const searchCriteria = req.query.searchCriteria;
    if (searchCriteria !== "") {
        const trackToSearch = await Track.find({
            name: { $regex: searchCriteria, $options: "i" }
        }).limit(10);
        const playlistToSearch = await Playlist.find({
            name: { $regex: searchCriteria, $options: "i" }
        }).limit(10);
        const resultOfQuery = { trackToSearch, playlistToSearch };
        res.status(200).send({ data: resultOfQuery });
    } else {
        res.status(200).send({});
    }
});

module.exports = router;