const express=require("express");
const router=express.Router({mergeParams:true});
// set mergeparams true because jeva tikdun common part send kela joato tehva fakt first parameter yete id yetach nahi tyamule merge params true kele
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js")
const listing=require("../models/listing.js")

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    //  console.log(result);
    if(error)
    {
        let errMsg=error.details.map((el)=> el.message).join(",");//if in some cases error details or multiple errors are occured then for bundling the function of all errors in one errMsg
        throw new ExpressError(400,errMsg);//if error occured
    }else{
        next();
    }

}
// reviews route
// post method
// make listings:id/reviews as a comman part /
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    // first find listing by id
    // console.log(req.params.id);
    let Listing=await listing.findById(req.params.id);
    // find review or seprate it out
    let newReview=new Review(req.body.review);//ye review object hai joo show.ejs main hai jismain comment orr review hai review[comment]
    // ab har ek listing ke andar reviews ka array hai
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    req.flash("success","New Review Created!")
    console.log("Review saved!");
    // res.redirect(`/listings/${req.params.id}`);
    res.redirect(`/listings/${Listing._id}`);
    // res.send("review saved!");

}))
// delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//listings ke andar id matlab 1k listing aur usme reviews array ke andar specific reviewid
    await Review.findByIdAndDelete(reviewId);//Review schema se delete kiys
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}))

module.exports=router;