const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config()

const mongourl = process.env.MONGO_URL;

mongoose.connect(mongourl)
.then(() => {
    // console.log("Connected Successfully");
})
.catch(() => {
    console.log("Error in connecting to DB reser");
});

const ReserveSchema = new mongoose.Schema({
    Rname: {
        type: String,
    },
    Rphone: {
        type: String,
    },
    Rmembers: {
        type: Number,
    },
    Rdate: {
        type: String,
    },
    Rtime: {
        type: String,
    }
}, { collection: 'Reservations' }); // Specify the new collection name here

const Reservations = mongoose.model("reserve", ReserveSchema);
module.exports = Reservations;
