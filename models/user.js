// defining model for login signup
const { string } = require("joi");
const mongoose=require("mongoose");
// require schema need to write mongoose.schema;  
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
    // username and password automatically add karega passportlocalMongoose schema banate vakt
})
userSchema.plugin(passportLocalMongoose);//username password hashing and salting automatically define karta hai.
module.exports = mongoose.model('User', userSchema);