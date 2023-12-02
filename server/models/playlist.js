const mongoose = require("mongoose");


const joi = require("joi");


const ObjectId = mongoose.Schema.Types.ObjectId;


const playlistSchema = new mongoose.Schema({
 name: {
   type: String,
   required: true,
 },
 user: {
   type: ObjectId,
   ref: "User",
   required: true,
 },
 description: {
   type: String,
 },
 tracks: [
   {
     type: ObjectId,
     ref: "Track",
     default: [],
   },
 ],
 img: {
   type: String,
   required: true,
 },
});


const validate = (playlist) => {
 const schema = joi.object({
   name: joi.string().required(),
   user: joi.string().required(),
   description: joi.string().allow(""),
   img: joi.string().allow(""),
   tracks: joi.array().items(joi.string),
 });
 return schema.validate(playlist);
};


const playlist = mongoose.model("playlist", playlistSchema);


module.exports = { playlist, validate};


