const express=require("express");
const router=express.Router({mergeParams:true});
// set mergeparams true because jeva tikdun common part send kela joato tehva fakt first parameter yete id yetach nahi tyamule merge params true kele
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js")
const listing=require("../models/listing.js")
const {validateReview}=require("../middleware.js")
const {isLoggedin,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/review.js")
// code of validate review is in middlware
// reviews route
// post method
// make listings:id/reviews as a comman part /
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.createReview))
// delete review route
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;