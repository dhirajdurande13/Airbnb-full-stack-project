const express=require("express");
const app=express();
const mongoose=require("mongoose");
let port=8080;
// require listing
const listing=require("./models/listing.js")
// installing ejs-mate
const ejsMate=require("ejs-mate");
// ejs setup 
const path=require("path");
const methodOverride=require("method-override");
// const listing = require("./models/listing.js");

// Mongoose connection
const mongo_url='mongodb://127.0.0.1:27017/wanderlust';
main()
.then(()=>{
    console.log("connected to db! " );
})
.catch((err)=>{
    console.log("Error occured in db!"+err);
})
async function main()
{
    await mongoose.connect(mongo_url);
}
// listing :villa,flat place diffrent places.
// project:airbnb

// basic api root
app.get("/",(req,res)=>{
    res.send("Hii I am root page!");
})
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
// use public folder
app.use(express.static(path.join(__dirname,"/public")));
// index route to show data
app.get("/listings",async (req,res)=>{
     const  allListings =await listing.find({});
     res.render("./listing/index.ejs",{ allListings });
    //  const  allListings = await listing.find({})
    //  .then((res)=>{
    //     res.render("/listing/index.ejs",{ allListings });
    //     // console.log(res)
    //     // res.send(res);
    // }).catch((err)=>{
    //     console.log("error: "+err);
    // })
})
// create new route :if new is below id route then it understand new as id and search
app.get("/listings/new",(req,res)=>{
    res.render("./listing/new.ejs");
})

// adding information in new route
app.post("/listings",async(req,res)=>{
    // let{title,description,image,price,country,location}=req.body;
    // insted of taking one one variable direct stored in listing and take.
    // let listing=req.body.listing;
    // console.log(listing);
    const newListing=new listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
})
// show route for particuler id:
app.get("/listings/:id" ,async (req,res)=>{
  let {id}=req.params;
  const Listing=await listing.findById(id);
  res.render("./listing/show.ejs",{Listing});
})

// edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const Listing=await listing.findById(id);
    res.render("./listing/edit.ejs",{Listing});
})
// update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    // ... means actually req.body.listing is java script object we convert it into induvidal by deconstructing
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

// delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
   let deleteListing= await listing.findByIdAndDelete(id);
//    console.log(deleteListing);
   res.redirect("/listings");
})
// test listing
app.get("/test",async(req,res)=>{
     let sampleListing=new listing({
        title:"My villa!",
        description:"Villa in Benglore",
        price:5000,
        location:"benglore",
        country:"India",

     });
     await sampleListing.save();
     res.send("sample saved!");
})
app.listen(port,()=>{
    console.log("port 8080 is listening!");
})
