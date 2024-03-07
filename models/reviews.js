// creating review section


const mongoose=require("mongoose");
// require schema no need to write mongoose.schema;  
const Schema=mongoose.Schema;
const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
    
})
let Review=mongoose.model("Review",reviewSchema);
module.exports=Review;