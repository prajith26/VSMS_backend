const express = require("express");
const bodyparser = require("body-parser");
const jwt=require('jsonwebtoken');


//Booking Schema
const Bookingdata = require("../models/bookingData");

//User Database
const Userdata = require("../models/userData");

//Chat DB
const Chatdata = require("../models/chatData");

//Create Route Handler
const userRouter = express.Router();

userRouter.use(bodyparser.json());
const urlencodedParser = bodyparser.urlencoded({extended:false});
userRouter.use(urlencodedParser);


function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    // console.log(token);
    if(token=="null"){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token,'secretKey')
    // console.log("verifytoken"+payload)
    if(!payload)
    {
        return res.status(401).send('Unauthorized request')
    }
    next()
}





userRouter.post('/newBook',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    Bookingdata.findOne({user_email:req.body.email,book_date:req.body.bookdate},function(err,data){
        if(err){
            console.log(err);
        }
        else if(!data){
            var item = {
                user_email              : req.body.user_email,
                book_date               : req.body.book_date,
                book_kilometer          : req.body.book_kilometer,
                book_vehicle            : req.body.book_vehicle ,
                book_vehicleNo          : req.body.book_vehicleNo,
                bookservice_oilFilter   : req.body.bookservice_oilFilter,
                bookservice_lubrication : req.body.bookservice_lubrication,
                bookservice_brakes      : req.body.bookservice_brakes,
                bookservice_engine      : req.body.bookservice_engine,
                bookservice_plug        : req.body.bookservice_plug,
                bookservice_battery     : req.body.bookservice_battery,
                bookservice_others      : req.body.bookservice_others,
                booking_status          : req.body.booking_status,
                booking_admin           : req.body.booking_admin,
                booking_completion      : req.body.booking_completion,
                booking_amount          : req.body.booking_amount,
                booking_reject          : req.body.booking_reject 
            }
        
            var booking = Bookingdata(item);
            console.log("New Booking:"+booking);
            booking.save();
            res.status(401).send({message:"Booking made. Wait for Admin to Confirm"});
        }
        else{
            res.status(401).send({message:"You already made a booking for this date"});
        }
    })
    
});

userRouter.post('/pending',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.body.email);
    Bookingdata.find({user_email:req.body.email,booking_status:false,booking_completion:false,booking_reject:false})
        .then(function(bookings){
            console.log("Pending:"+bookings);
            res.send(bookings);
        });
})
userRouter.post('/approved',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");

    Bookingdata.find({user_email:req.body.email,booking_status:true,booking_completion:false,booking_reject:false})
        .then(function(bookings){
            console.log(bookings);
            res.send(bookings);
        });
})
userRouter.post('/completed',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");

    Bookingdata.find({user_email:req.body.email,booking_status:true,booking_completion:true,booking_reject:false})
        .then(function(bookings){
            console.log(bookings);
            res.send(bookings);
        });
})

userRouter.post('/details',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.body.user_email);
    Userdata.find({user_email:req.body.user_email})
    .then(function(user){
        console.log(user);
        res.send(user);
    });
});

userRouter.put('/update',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    
    var item = {
        user_email              : req.body.user_email,
        book_date               : req.body.book_date,
        book_kilometer          : req.body.kilometer,
        book_vehicle            : req.body.book_vehicle ,
        book_vehicleNo          : req.body.book_vehicleNo,
        bookservice_oilFilter   : req.body.bookservice_oilFilter,
        bookservice_lubrication : req.body.bookservice_lubrication,
        bookservice_brakes      : req.body.bookservice_brakes,
        bookservice_engine      : req.body.bookservice_engine,
        bookservice_plug        : req.body.bookservice_plug,
        bookservice_battery     : req.body.bookservice_battery,
        bookservice_others      : req.body.bookservice_others,
        booking_status          : req.body.booking_status,
        booking_admin           : req.body.booking_admin,
        booking_completion      : req.body.booking_completion,
        booking_amount          : req.body.booking_amount
    }
    Bookingdata.findOneAndUpdate({user_email:req.body.user_email,book_date:req.body.book_date},item,{ new: true},(err,doc)=>{
        if(!err){
            console.log(doc);
        }
        else{
            console.log(err);
        }
    });
});

userRouter.post('/getchat',verifyToken,function(req,res){

    Chatdata.find({user_email:req.body.email})
    .then(function(chat){
        console.log(chat);
        res.send(chat);
    });
})

userRouter.post('/postchat',verifyToken,function(req,res){

    var item = {
        user_email              : req.body.user_email,
        msg_user                : req.body.msg_user,
        msg_admin               : req.body.msg_admin
    }
    var chat = Chatdata(item);
    console.log("New Chat:"+chat);
    chat.save();
    res.send(chat);
})

userRouter.post('/deletechat',verifyToken,function(req,res){
    Chatdata.remove({user_email:req.body.user_email},(err,doc)=>{
        if(!err){
            console.log("Chat deleted"+doc);
        }
        else{
            console.log(err);
        }
    });
});

userRouter.post('/deletepending',verifyToken,function(req,res){
    Bookingdata.findOneAndRemove({user_email:req.body.user_email},(err,doc)=>{
        if(!err){
            console.log("Pending Req deleted"+doc);
        }
        else{
            console.log(err);
        }
    });
})

module.exports = userRouter;
