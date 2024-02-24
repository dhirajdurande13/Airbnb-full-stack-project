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
const methodOverride=require("method-override");//for put patch delete
// const listing = require("./models/listing.js");
// importing wrap async

const wrapAsync=require("./utils/wrapAsync.js");//wrap async using at the place of try catch block while handaling errrors
// importing express error

const ExpressError=require("./utils/ExpressError.js");


// requiring schema validations file
const {listingSchema,reviewSchema}=require("./schema.js");


// require review
const Review=require("./models/reviews.js")

// requiring listings from routes all listing methods
const Listings=require("./routes/listing.js");
// require reviews from routes
const reviews=require("./routes/review.js");

// requiring session
const session=require("express-session");
const flash=require("connect-flash")
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


const sessionOptions={
    secret:"mysecreatsupercode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        // cookie option which set expiry date for cookies
        expires:Date.now()+7*24*60*60*1000,//datenow returns current time in mili seconds and it expires after 7 days we have to write exact in 7 days
        maxAge:7*24*60*60*1000,
        httpOnly:true,//genrally used for security purpose cross scripting
    }
}
// basic api root
app.get("/",(req,res)=>{
    res.send("Hii I am root page!");
})
app.use(session(sessionOptions));     
app.use(flash());  
//after saving the listing it creates flash and redirect to /listings and then before sending responce it check middleware which declaered given below
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    // console.log(res.locals.success);//success is empty but it has no length
    next();//in case if we forgot to call next then we are stuck here and next process is pending...
})






app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
// use public folder
app.use(express.static(path.join(__dirname,"/public")));
// when restructuring
// 1 use here your imported file in common route like /listings is common route here it uses insted /
app.use("/listings",Listings);//jaha par Listings yete tithe Listings use karnar

app.use("/listings/:id/reviews",reviews);//listings id reviews ye parameter review main jayenge yaha se



// test listing
app.get("/test",wrapAsync(async(req,res)=>{
     let sampleListing=new listing({
        title:"My villa!",
        description:"Villa in Benglore",
        price:5000,
        location:"benglore",
        country:"India",

     });
     await sampleListing.save();
     res.send("sample saved!");
}))
// for if api not matched for all request we have to use all
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));//yaha se err throw kiya jayega ..
})


// defining custom error handler for checking server side errors 
app.use((err,req,res,next)=>{
    // res.send("something went wrong!");

    let {statusCode=500,message="Something went wrong!"}=err;//statuscode aur message nikalenge aur throw karenge
    // res.status(statusCode).send(message);
    // for alert
    res.status(statusCode).render("error.ejs",{err});
})
// here sequence matter while passing the arguments bec:express  Express recognizes middleware functions with four arguments (err, req, res, next) as error-handling middleware.

app.listen(port,()=>{
    console.log("port 8080 is listening!");
})
