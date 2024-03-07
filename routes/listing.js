const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
// require listing
const listing = require("../models/listing.js")//..because we are in parent directory
// requiring looged in fxn'
const {isLoggedin}=require("../middleware.js")
const {isOwner,validateListing}=require("../middleware.js")
const multer  = require('multer')
// requiring details from cloud config.js
const {storage}=require("../cloudConfig.js")
// const upload = multer({ dest: 'uploads/' })//saving destination is uploads multer will create automatically folder name uploads
const upload = multer({ storage })//saving in cloudinary storage

const listingController=require("../controllers/listings.js")
// defining validate function here
// code of validateListing is shifted to middlware
// arranging all listing routes
// index route to show data
// shifting code to controller

router.route("/")
        .get( wrapAsync(listingController.index))//no need to define path everytime in get post request
        .post(isLoggedin,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing))
        // .post(upload.single('listing[image]'),(req,res)=>{//only for checking which data is sended for file
        //     res.send(req.file);
        //     // upload.single middelware single image ko uplads folder main save karegi 
        // })
// combining same path requests /

// create new route :if new is below id route then it understand new as id and search
router.get("/new",isLoggedin,listingController.renderNewForm)//agar ye niche rahega toh new/:id ki traha treat kiya jayega
router.route("/:id")
        .get(wrapAsync(listingController.showListings))
        .put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
        .delete(isLoggedin,isOwner, wrapAsync(listingController.destroyListing))
// code shifted in routeer.route
// router.get("/", wrapAsync(listingController.index))
// passing index fxn for controller


// adding information in new route
// passing validateListing as a middleware

// code shifted in routeer.route
// router.post("/", validateListing, wrapAsync(listingController.createListing))
// show route for particuler id:
// code is in router.route
// router.get("/:id", wrapAsync(listingController.showListings))

// edit route
router.get("/:id/edit",isLoggedin,isOwner, wrapAsync(listingController.renderEditForm))
// update route
// validate listing passing as a middleware for checking validate schema
// code is in router.route
// router.put("/:id", validateListing,isLoggedin,isOwner, wrapAsync(listingController.updateListing))

// delete route
// code is in router.route
// router.delete("/:id",isLoggedin,isOwner, wrapAsync(listingController.destroyListing))

module.exports = router;
