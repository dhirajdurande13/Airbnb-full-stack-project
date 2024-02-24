const mongoose=require("mongoose");
// require schema no need to write mongoose.schema;  
const Schema=mongoose.Schema;
// require review model it is necessary for deleting
const Review=require("./reviews.js")
// declare schema
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        // if image is not given value
        default:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        // thise in case only image is  given but link is not given:for setting default value in mongoo db use v thise is tertiary operator
        set:(v)=>v ==="" ? "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }]
})
// defining middleware if whole listing is deleted all reviews must be deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
        await Review.deleteMany({ _id:{ $in :listing.reviews}})
    }
})

// creating model
const listing=mongoose.model("listing",listingSchema);
// export model to app.js
 module.exports=listing;