// users.js
const router = require("express").Router();

const { User } = require("../models/user");
const { Track } = require("../models/track");
const {Playlist, validate} = require("../models/playlist")

const auth = require("../middleware/auth");
const validObjectId = require("../middleware/validObjectId");
const joi = require("joi")

// POST playlist to create a new playlist 

router.post("/", async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send({ message: error.details[0].message });

    const userCreatingPlaylist = await User.findById(req.user._id);
    const playlistToCreate = await Playlist({...req.body, user:userCreatingPlaylist._id}).save();
    userCreatingPlaylist.playlistToCreate.push(playlistToCreate._id);
    await userCreatingPlaylist.save();

    res.status(201).send({ data: playlistToCreate, message: "Playlist created Successfully!" })
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

// EDIT playlist by Id
router.put("edit/:id", [validObjectId, auth], async (req, res) => {
    const updatedPlaylistSchema = joi.object({
        name:joi.string().required(),
        desc: joi.string().allow(""),
        img: joi.string().allow("")
    });

    const {error} = updatedPlaylistSchema.validate(req.body);
    if (error) return res.status(400).send({message: error.details[0].message});

    const playlistToUpdate = await Playlist.findById(req.params.id);
    if(!playlistToUpdate) return res.status(404).send({message: "Playlist not found"});

    const userUpdating = await User.findById(req.user._id);
    if (!userUpdating._id.equals(playlistToUpdate.user))
        return res.status(403).send({message: "User does not have access to edit"})

    playlistToUpdate.name = req.body.name;
    playlistToUpdate.desc = req.body.desc;
    playlistToUpdate.img = req.body.img;

    await playlistToUpdate.save();

    res.status(403).send({message: "Playilst Updated Successfully"})

});

// add song to the playlist 
router.put("/add-track", auth, async (req, res) => {
    const addTrackSchema = joi.object({
        playlistId:joi.string().required(),
        trackId: joi.string().allow(""),
    });
    const { error } = addTrackSchema.validate(req.body);

    if (error) return res.status(400).send({message: error.details[0].message});

    const userAdding = await User.findById(req.user._id);
    const playlistToAddTo = await Playlist.findById(req.body.playlistId);

    if(!userAdding._id.equal(playlistToAddTo.user))
        return res.status(403).send({message: "User does not have access to add track"})

    if(playlistToAddTo.tracks.indexOf(req.body.trackId) === -1) {
        playlistToAddTo.tracks.push(req.body.trackId)
    };

    await playlistToAddTo.save();
    res.status(200).send({data: playlistToAddTo, message: "Track added to playlist"})

});

// remove song from playlist
router.put("/remove-track", auth, async (req, res) => {
    const removeTrackSchema = joi.object({
        playlistId:joi.string().required(),
        trackId: joi.string().allow(""),
    });
    const { error } = removeTrackSchema.validate(req.body);
    if (error) return res.status(400).send({message: error.details[0].message});

    const userRemoving = await User.findById(req.user._id);
    const playlistToRemoveFrom = await Playlist.findById(req.params.id);

    if(!userRemoving._id.equal(playlistToRemoveFrom.user))
        return res.status(403).send({message: "User does not have access to remove track"})

    const index = playlistToRemoveFrom.tracks.indexOf(req.body.trackId);
    playlistToRemoveFrom.tracks.splice(index, 1);

    await playlistToAddTo.save();
    res.status(200).send({data: playlistToAddTo, message: "Track removed to playlist"});
});

// user favourite playlist
router.get("/favourite", auth, async (req, res) => {
    const userFaving = await User.findById(req.userFaving._id);
    const favPlaylists = await Playlist.find({_id:userFaving.playlists});
    res.status(200).send({data: favPlaylists});
});

// get random playlist
router.get("/random", auth, async (req, res) => {
    const playlists = await Playlist.aggregate([{$sample: {size:10}}]);
    res.status(200).send({data: playlists});
});

// get playlist by id and song
router.get("/:id", [validObjectId, auth], async (req, res) => {
    const playlists = await Playlist.findById(req.params.id);
    if (!playlists) return res.status(404).send("playlist not found");

    const trackInPlaylist = await Track.find({_id: playlists.tracks});
    res.status(200).send({data: {trackInPlaylist, trackInPlaylist}});
});

// get all playlists
router.get("/", auth, async (req, res) => {
    const allPlaylists = await Playlist.find();
    res.status(200).send({data: allPlaylists});
});

// DELETE playlist by id
router.delete("/:id", [validObjectId, auth], async (req, res) => {
    const userDeleting = await User.findById(req.userDeleting._id);
    const playlistToDeleteFrom = await Playlist.findById(req.params.id);

    if (!userDeleting._id.equals(playlistToDeleteFrom.user))
        return res.status(403).send({message: "User doesnt have access to delete"});

    const index = User.playlists.indexOf(req.params.id);
    userDeleting.playlists.splice(index, 1);
    await userDeleting.save();
    await playlistToDeleteFrom.remove();
    
    res.status(200).send({message: "Removed from library"});
});

module.exports = router;