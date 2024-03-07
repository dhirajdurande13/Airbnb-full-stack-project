const listing = require("../models/listing.js")//..because we are in parent directory 
// requiring sdk for geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });//making baseclient
module.exports.index=async (req, res) => {
    const allListings = await listing.find({});
    // console.log("test")
    res.render("./listing/index.ejs", { allListings });
    //  const  allListings = await listing.find({})
    //  .then((res)=>{
    //     res.render("/listing/index.ejs",{ allListings });
    //     // console.log(res)
    //     // res.send(res);
    // }).catch((err)=>{
    //     console.log("error: "+err);
    // })
 }
 module.exports.renderNewForm=(req, res) => {

    // all part is in middleware.js
    // console.log(req.user);//user ne login karne ke bad user related ifo store hotin hai
    // // yahi use related information trigger karti hai ki user login hai ya nahi check karne ke liye
    // if(!req.isAuthenticated())//iss logic ko ya toh wdit dwlwtw sab jagah coppy kar sakte hai yaa middleware ke through pass kar sakte hai
    // {
    //    req.flash("error","you must be loged in to create listing!");
    //   return res.redirect("/login");//ig we arre not returning it gives error  to avoid thise error use return in res.redirect
 
    //   Cannot set headers after they are sent to the client 
    //  at new NodeError (node:internal/errors:405:5)
    //  at ServerResponse.setHeader (node:_http_outgoing:648:11)
    //  at ServerResponse.header (D:\WEB_D\Major_Project\node_modules\express\lib\response.js:794:10)
    //  at ServerResponse.send (D:\WEB_D\Major_Project\node_modules\express\lib\response.js:174:12)
    //  at done (D:\WEB_D\Major_Project\node_modules\express\lib\response.js:1035:10)
    //  at D:\WEB_D\Major_Project\node_modules\ejs-mate\lib\index.js:356:7
    //  at tryHandleCache (D:\WEB_D\Major_Project\node_modules\ejs\lib\ejs.js:280:5)
    //  at exports.renderFile (D:\WEB_D\Major_Project\node_modules\ejs\lib\ejs.js:491:10)
    //  at renderFile (D:\WEB_D\Major_Project\node_modules\ejs-mate\lib\index.js:298:7)
    //  at D:\WEB_D\Major_Project\node_modules\ejs-mate\lib\index.js:353:7
    // }
    res.render("./listing/new.ejs");
 }

 module.exports.showListings=async (req, res) => {
    let { id } = req.params;
    // using now nested populate because we have to populate review inside review owner
    const Listing = await listing.findById(id)
    .populate({
       path:"reviews",
       populate:{
          path:"author",
       }
    })
    .populate("owner");//owner ki info bhi populate kardo
    //  find by id ke bad sirf id dikha deta hai terminal par .populate karne ke baad puri listing aa jati hai
    if (!Listing) {
       req.flash("error", "Listing you requested for does not exists!")
       res.redirect("/listings");
    }
   //  console.log(Listing);
    res.render("./listing/show.ejs", { Listing });
 }

 module.exports.createListing=async (req, res, next) => {
      // implementing geocoding
     let response=await geocodingClient.forwardGeocode({
         // query: 'New Delhi,India',
         query: req.body.listing.location,//specific location ke co-ordinates
         limit: 1 //specific location ke kitne co-ordinates chahiye agar india dala toh bahot co-ordinates ayenge ye bydefault 5 set hoti  hai
       })
         .send();
      //  console.log(response.body.features[0].geometry);
      //  res.send("done!");
      // implementing file details
      let url=req.file.path;
      let filename=req.file.filename;
      // console.log(url,"..",filename);

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
 
 
    // you have to save owner also
    // console.log(req.user);//gives all info of user
     newListing.owner=req.user._id;//jab bhi nayi listing create ho rahi ho toh jo user use save kar raha hai uski detail store honi chahiye
     newListing.image={url,filename};
     newListing.geomatry=response.body.features[0].geometry;//saving geomatry
  let savedListing= await newListing.save();
//   console.log(savedListing);
    req.flash("success", "New listing created!");
    res.redirect("/listings");
 
 }

 module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing) {
       req.flash("error", "Listing you requested for does not exists!")
       res.redirect("/listings");
    }
// for making low quality image original image ki quality kam kar rahe hai
    let originalImageUrl=Listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listing/edit.ejs", { Listing ,originalImageUrl});
 }
 module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    // ... means actually req.body.listing is java script object we convert it into induvidal by deconstructing
       // yaha par kaise kar rahe hai:ek hi step main find by id aur update kar rahe hai 
   // agar image ke lava koi change hai toh yaha store hoga
   let Listing=await listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof req.file!=="undefined")
   {
      // typeof for checking object type like null undefined
      let url=req.file.path;
      let filename=req.file.filename;
     // image yaha update hogi
     Listing.image={url,filename};
     await Listing.save();
   //   req file exist karni chahiye agar empty submit kiya toh
   }
   
 //   yaha ka code middlware me shift kiya hai isOwner
   
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
 }
 module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deleteListing = await listing.findByIdAndDelete(id);
    //    console.log(deleteListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
 }