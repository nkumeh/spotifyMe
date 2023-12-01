// database.js
const mongoose = require('mongoose');
const dbHost = process.env.DB_MONGO;


const connectDB = async () => {
 console.log("Script started");
// Your database connection setup
 try {
   await mongoose.connect(dbHost); // connect to db


   console.log('MongoDB connected successfully');
   console.log("Database connection setup complete");


 } catch (error) {
   console.error('MongoDB connection failed:', error.message);
   process.exit(1);
 }
};

module.exports = connectDB;



// const { MongoClient } = require("mongodb");


// const dbHost = process.env.DB_HOST;




// const username = encodeURIComponent("<username>");
// const password = encodeURIComponent("<password>");
// const cluster = "<clusterName>";
// const authSource = "<authSource>";
// const authMechanism = "<authMechanism>";


// let uri =
//   `mongodb+srv://${username}:${password}@${cluster}/?authSource=${authSource}&authMechanism=${authMechanism}`;


// const client = new MongoClient(uri);


// async function run() {
//   try {
//     await client.connect();


//     const database = client.db("<dbName>");
//     const ratings = database.collection("<collName>");


//     const cursor = ratings.find();


//     await cursor.forEach(doc => console.dir(doc));
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);


