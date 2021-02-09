//Access mongoose package
const mongoose = require("mongoose");

//Schema definition
const Schema = mongoose.Schema;

//Define structure of Bookingdata collection using Schema constructor
const ChatSchema = new Schema({
    user_email              : { type: String },
    msg_user                : { type: String },
    msg_admin               : { type: String },
    msg_date                : { type: Date, default:Date.now }
});


//Create model Userdata
var Chatdata = mongoose.model('Chatdata', ChatSchema);

//exports
module.exports = Chatdata;

