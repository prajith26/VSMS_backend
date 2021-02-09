//Access mongoose package
const mongoose = require("mongoose");

//Schema definition
const Schema = mongoose.Schema;

//Define structure of Bookingdata collection using Schema constructor
const BookingSchema = new Schema({
    user_email              : { type: String, required: true },
    book_date               : { type: String, required: true },
    book_kilometer          : { type: String, required: true },
    book_vehicle            : { type: String, required: true },
    book_vehicleNo          : { type: String, required: true },
    bookservice_oilFilter   : { type: Boolean, required: true },
    bookservice_lubrication : { type: Boolean, required: true },
    bookservice_brakes      : { type: Boolean, required: true },
    bookservice_engine      : { type: Boolean, required: true },
    bookservice_plug        : { type: Boolean, required: true },
    bookservice_battery     : { type: Boolean, required: true },
    bookservice_others      : { type: String, required: true },
    booking_status          : { type: Boolean },
    booking_admin           : { type: String  },
    booking_completion      : { type: Boolean },
    booking_amount          : { type: String  },
    booking_reject          : { type: Boolean }
});


//Create model Userdata
var Bookingdata = mongoose.model('Bookingdata', BookingSchema);

//exports
module.exports = Bookingdata;

