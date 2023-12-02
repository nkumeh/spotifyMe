// Track Schema
const mongoose = require('mongoose');

const joi = require("joi");

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
   },
  artist: {
    type: String,
    required: true
   },
  mp3: {
    type: String,
    required: true
   },
  img: {
    type: String,
    required: true
   },
  duration: {
    type: Number,
    required: true 
   },
   // album: {
   //   type: mongoose.Schema.Types.ObjectId,
   //   ref: 'Album',
   //   // required: true
   // }
});


const validate = (track) => {
  const schema = joi.object({
    name: joi.string().required(),
    artist: joi.string().email().required(),
    mp3: joi.string().required(),
    img: joi.string().required(),
    duration: joi.number().required(),
  });
  
  return schema.validate(track)
}

const track = mongoose.model('track', trackSchema);

module.exports = {track, validate};