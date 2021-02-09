const express = require("express");
const bodyparser = require("body-parser");

//access Userdata Schema
const Userdata = require('../models/userData');

//create seperate route handler for Admin
const registerRouter = express.Router();

registerRouter.use(bodyparser.json());
const urlencodedParser = bodyparser.urlencoded({ extended: false });
registerRouter.use(urlencodedParser);


registerRouter.post('/',function(req,res){

    Userdata.findOne({user_email:req.body.email},(err,user)=>{
        if(err){
            console.log(err);
            res.status(401).send(err);
        }
        //Register for New User
        if(!user){
            var item = {
                user_name: req.body.name,
                user_email: req.body.email,
                user_password: req.body.pwd,
                user_mobile: req.body.mobile,
                user_address: req.body.address
            }
            var users = Userdata(item);
            users.save();
            console.log("User Registration Successfull. Please Login to continue");
            res.json({success:true, message: 'User Registration Successfull. Please Login to continue'}); 
        }
        //Already a registerd User
        else{
            console.log( "User alreasy exists. Please login to continue");
            res.json({success:false, message: "User alreasy exists. Please login to continue"}); 
        }
    });
});
module.exports = registerRouter;