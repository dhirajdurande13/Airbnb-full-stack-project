const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
// require listing
const listing = require("../models/listing.js")//..because we are in parent directory



// defining validate function here
const validateListing = (req, res, next) => {
   let { error } = listingSchema.validate(req.body);
   //  console.log(result);
   if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");//if in some cases error details or multiple errors are occured then for bundling the function of all errors in one errMsg
      throw new ExpressError(400, errMsg);//if error occured
   } else {
      next();
   }

}
// arranging all listing routes
// index route to show data
router.get("/", wrapAsync(async (req, res) => {
   const allListings = await listing.find({});
   res.render("./listing/index.ejs", { allListings });
   //  const  allListings = await listing.find({})
   //  .then((res)=>{
   //     res.render("/listing/index.ejs",{ allListings });
   //     // console.log(res)
   //     // res.send(res);
   // }).catch((err)=>{
   //     console.log("error: "+err);
   // })
}))
// create new route :if new is below id route then it understand new as id and search
router.get("/new", (req, res) => {
   res.render("./listing/new.ejs");
})

// adding information in new route
// passing validateListing as a middleware
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
   // let{title,description,image,price,country,location}=req.body;
   // insted of taking one one variable direct stored in listing and take.
   // let listing=req.body.listing;
   // console.log(listing);


   // thise is one way of checking schema validations
   // if(!req.body.listing)
   // {
   //     throw new ExpressError(400,"Send Valid data for Listing!");//400 is bad request if empty listing is sending from hopscotch then we have to handle
   // }
   // sending to schema validations

   const newListing = new listing(req.body.listing);
   // if(!newListing.title)
   // {
   //     throw new ExpressError(400,"Title is missing!");
   // }
   // if(!newListing.description)
   // {
   //     throw new ExpressError(400,"Description is missing!");
   // }
   // if(!newListing.location)
   // {
   //     throw new ExpressError(400,"Location is missing!");
   // }



   await newListing.save();
   req.flash("success", "New listing created!");
   res.redirect("/listings");

}))
// show route for particuler id:
router.get("/:id", wrapAsync(async (req, res) => {
   let { id } = req.params;
   const Listing = await listing.findById(id).populate("reviews");
   //  find by id ke bad sirf id dikha deta hai terminal par .populate karne ke baad puri listing aa jati hai
   if (!Listing) {
      req.flash("error", "Listing you requested for does not exists!")
      res.redirect("/listings");
   }
   res.render("./listing/show.ejs", { Listing });
}))

// edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
   let { id } = req.params;
   const Listing = await listing.findById(id);
   if (!Listing) {
      req.flash("error", "Listing you requested for does not exists!")
      res.redirect("/listings");
   }
   res.render("./listing/edit.ejs", { Listing });
}))
// update route
// validate listing passing as a middleware for checking validate schema
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
   let { id } = req.params;
   // ... means actually req.body.listing is java script object we convert it into induvidal by deconstructing
   await listing.findByIdAndUpdate(id, { ...req.body.listing });
   req.flash("success", "Listing Updated!")
   res.redirect(`/listings/${id}`);
}))

// delete route
router.delete("/:id", wrapAsync(async (req, res) => {
   let { id } = req.params;
   let deleteListing = await listing.findByIdAndDelete(id);
   //    console.log(deleteListing);
   req.flash("success", "Listing deleted successfully!");
   res.redirect("/listings");
}))

module.exports = router;
