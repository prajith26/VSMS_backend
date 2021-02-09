const express = require("express");
const bodyparser = require("body-parser");
const jwt=require('jsonwebtoken');

//Booking Schema
const Bookingdata = require("../models/bookingData");

//Create Route Handler
const adminRouter = express.Router();

//Chat DB
const Chatdata = require("../models/chatData");

adminRouter.use(bodyparser.json());
const urlencodedParser = bodyparser.urlencoded({extended:false});
adminRouter.use(urlencodedParser);

function verifyAdmin(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    // console.log(token);
    if(token=="null"){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token,'secretKey')
    console.log(payload)
    if(!payload)
    {
        return res.status(401).send('Unauthorized request')
    }
    if(payload.subject=="admin@gmail.comAdmin123"){
        console.log("testing")
        next()
    }
   
}

adminRouter.get('/pending',verifyAdmin,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    
    Bookingdata.find({booking_status:false,booking_completion:false,booking_reject:false})
    .then(function(bookings){
        console.log(bookings);
        res.send(bookings);
    });
});

adminRouter.get('/approved',verifyAdmin,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    
    Bookingdata.find({booking_status:true,booking_completion:false,booking_reject:false})
    .then(function(bookings){
        console.log(bookings);
        res.send(bookings);
    });
});

adminRouter.get('/completed',verifyAdmin,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    
    Bookingdata.find({booking_status:true,booking_completion:true,booking_reject:false})
    .then(function(bookings){
        console.log(bookings);
        res.send(bookings);
    });
});

adminRouter.put('/update',verifyAdmin,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.body.email);
    Bookingdata.findOneAndUpdate({user_email:req.body.email,book_date:req.body.date,booking_reject:false},{$set:{booking_status:true}},{new:true})
    .then(function(bookings){
        console.log(bookings);
        res.send(bookings);
    })
})

adminRouter.put('/reject',verifyAdmin,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.body.email);
    Bookingdata.findOneAndUpdate({user_email:req.body.email,book_date:req.body.date},{$set:{booking_reject:true}},{new:true})
    .then(function(bookings){
        console.log(bookings);
        res.send(bookings);
    })
})

adminRouter.post('/getchat',verifyAdmin,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log("Email:"+req.body.email)
    Chatdata.find({user_email:req.body.email})
    .then(function(chat){
        console.log(chat);
        res.send(chat);
    });
})

adminRouter.post('/postchat',verifyAdmin,function(req,res){

    var item = {
        user_email              : req.body.user_email,
        msg_user                : req.body.msg_user,
        msg_admin               : req.body.msg_admin
    }
    var chat = Chatdata(item);
    console.log("New Chat:"+chat);
    chat.save();
    res.send(chat);
});

adminRouter.put('/addamount',verifyAdmin,function(req,res){
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

adminRouter.post('/deletechat',verifyAdmin,function(req,res){
    Chatdata.remove({user_email:req.body.user_email},(err,doc)=>{
        if(!err){
            console.log("Chat deleted"+doc);
        }
        else{
            console.log(err);
        }
    });
});

adminRouter.delete('/deletereject',verifyAdmin,function(req,res){
    Bookingdata.remove({booking_reject:true},(err,doc)=>{
        if(!err){
            console.log("Reject Req Removed"+doc);
        }
        else{
            console.log(err);
        }
    });
});

module.exports = adminRouter;