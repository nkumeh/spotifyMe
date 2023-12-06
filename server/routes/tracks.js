// users.js
const router = require("express").Router();
const { User, validate } = require("../models/user");
const { Track, validate } = require("../models/track");
const bcrypt = require("bcrypt");
const admin = require("../middleware/admin");
const validObjectId = require("../middleware/validObjectId");

// POST Track to create a new user
router.post("/", async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send({ message: error.details[0].message });

    const trackToCreate = await Track(req.body).save();

    res.status(201).send({ data: trackToCreate, message: "Track Created Successfully!" })
});

// GET all tracks 
router.get("/", async (req, res) => {
    const tracksToGet = await Track.find();
    res.status(200).send({data: tracksToGet});
});

// GET Tracks by Id
router.get("/:id", [validObjectId, auth], async (req, res) => {
    const userToGet = await User.findById(req.params.id).select("-password-__v");
    res.status(200).send({data: userToGet});
});

// UPDATE tracks by Id
router.put("/:id", [validObjectId, admin], async (req, res) => {
   try { 
    const trackToUpdate = await Track.findByIdAndUpdate(
        req.params.id, 
        {$set: req.body},
        {new:true})
        .select("-password-__v");
    } catch (error) {
        res.status(200).send(error, {data: trackToUpdate});
    }
});

// DELETE tracks by id
router.delete("/:id", [validObjectId, admin], async (req, res) => {
    try {
    const trackToDelete = await Track.findByIdAndDelete(res.params.id);
    res.status(200).send({data: trackToDelete, message: "Successfully Deleted Track"})
    } catch (error) {
        res.status(500).send(error);
    }
});

// LIKE song
router.put("/like/:id", [validObjectId, auth], async (req, res) => {
    try { 
        let resMessage = ""
        const trackToLike = await Track.findById(req.params.id);
        if (!trackToLike) 
            return res.status(400).send({message: "Track Unavailable or Does not exist"});

        const userLiking = await User.findById(req.user._id);
        const index = user.likedSongs.indexOf(trackToLike._id);

        if (index === -1) {
            userLiking.likedSongs.push(song._id);
            resMessage = "Added to your liked songs"
        } else {
            userLiking.likedSongs.splice(index, 1);
            resMessage = "Removed from your liked songs"
        }
        } catch (error) {
            res.status(200).send(error, {message: resMessage});
     }
 });


// get all LIKED songs
router.get("/like", auth, async (req, res) => {
    const userLiking = await User.findById(req.user._id);
    const likedSongs = await Track.find({_id:userLiking.likedSongs})
    res.status(200).send({data: likedSongs});
});


module.exports = router;