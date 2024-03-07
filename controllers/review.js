const listing = require("../models/listing.js")//..because we are in parent directory 
const Review=require("../models/reviews.js")
module.exports.createReview=async(req,res)=>{
    // first find listing by id
    // console.log(req.params.id);
    let Listing=await listing.findById(req.params.id);
    // find review or seprate it out
    let newReview=new Review(req.body.review);//ye review object hai joo show.ejs main hai jismain comment orr review hai review[comment]
    // newreview ke andar author ko bho store karo
    newReview.author=req.user._id;
    // ab har ek listing ke andar reviews ka array hai
    // console.log(newReview);
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    req.flash("success","New Review Created!")
    // console.log("Review saved!");
    // res.redirect(`/listings/${req.params.id}`);
    res.redirect(`/listings/${Listing._id}`);
    // res.send("review saved!");

}
// destroy is industry convention for delete
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//listings ke andar id matlab 1k listing aur usme reviews array ke andar specific reviewid
    await Review.findByIdAndDelete(reviewId);//Review schema se delete kiys
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}