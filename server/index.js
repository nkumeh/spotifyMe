// index.js
require("dotenv").config();
require("express-async-error") //basically takes care of async errors


const express = require('express');
const cors = require("cors")

// const port = process.env.PORT || 8080;

const bodyParser = require('body-parser');
const connectDB = require('./database');

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const trackRoutes = require('./routes/tracks');

const app = express();

const PORT = process.env.PORT || 3000;

// const user = require('./models/user'); // Import your artist model
// const playlist = require('./models/playlist'); // Import your album model
// const track = require('./models/track'); // Import your track model

connectDB(); // Connect to the database


app.use(cors());
app.use(bodyParser.json());

app.use("/api/users/", userRoutes);
app.use("/api/login/", authRoutes);
app.use("/api/tracks", trackRoutes);

app.listen(PORT, () => console.log(`Server running and listening on port ${PORT}...`));
