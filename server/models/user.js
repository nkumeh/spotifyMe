const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


const userSchema = new mongoose.Schema({
 name: {
   type: String,
   required: true,
 },
 email: {
   type: String,
   required: true,
   unique: true,
 },
 password: {
   type: String,
   required: true,
 },
 gender: {
   type: String,
   required: true,
 },
 month: {
   type: String,
   required: true,
 },
 date: {
   type: String,
   required: true,
 },
 year: {
   type: String,
   required: true,
 },
 likedSongs: {
   type: [String],
   default: [],
 },
 playlists: {
   type: [String],
   default: [],
 },
 isAdmin: {
   type: Boolean,
   default: false,
 },
});


userSchema.methods.generateAuthToken = function () {
 const token = jwt.sign(
   {
     _id: this.id,
     name: this.name,
     isAdmin: this.isAdmin,
   },
   process.env.JWTPRIVATEKEY,
   { expiresIn: "7d" }
 );
 return token;
};


const validate = (user) => {
 const schema = joi.object({
   name: joi.string().min(5).max(10).required(),
   email: joi.string().email().required(),
   password: passwordComplexity().required(),
   gender: joi.string().required(),
   month: joi.string().required(),
   date: joi.string().required(),
   year: joi.string().required(),
   isAdmin: joi.string().valid("female, non-binary, male").required(),
 });
 return schema.validate(user);
};


const user = mongoose.model("user", userSchema);


module.exports = { user, validate };

