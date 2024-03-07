// accessing env file variables
// we cannot access directly we have to use npm library dotenv backend ke sath integrate karne ke liye
if(process.env.NODE_ENV !="production")
{
    require('dotenv').config();//ewquiring dotenv library
    // jab hum devlopment phase main hai tabhi hum isse .env file use kar sakte hai otherwise nahi production yane deployment phase main credentials na use ho paye
    // NODE_ENV jo enviorment set karenge bad main
}

// console.log(process.env.secret)
const express=require("express");
const app=express();
const mongoose=require("mongoose");
let port=8082;
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
const ListingsRouter=require("./routes/listing.js");
// require reviews from routes
const reviewsRouter=require("./routes/review.js");
// importing user
const userRouter=require("./routes/user.js");

// requiring session
const session=require("express-session");

const MongoStore = require('connect-mongo');//this package is for storing cookies and session on cloud when we are not deploying it is stored in local machine

const flash=require("connect-flash")

// requiring passport for authentication
const passport=require("passport");
const LocalStatergy=require("passport-local");
const User=require("./models/user.js");
// Mongoose connection
// const mongo_url='mongodb://127.0.0.1:27017/wanderlust';

const dbUrl=process.env.ATLASDB_URL;
// mongo connect with deployed database
main()
.then(()=>{
    console.log("connected to db! " );
})
.catch((err)=>{``
    console.log("Error occured in db!"+err);
})
async function main()
{
    // await mongoose.connect(mongo_url);
    await mongoose.connect(dbUrl);
}
// listing :villa,flat place diffrent places.
// project:airbnb

// using mongo-connect
const store = MongoStore.create({
    mongoUrl: dbUrl,//jo bhi url pass karenge uske andar ye save hoga
    crypto:{
        secret:process.env.SECRET, // See below for details
        // genrally it used in normal but in case of sensetove info stored in crypto
    },
    touchAfter:24*3600,//passed in terms of seconds basically touch after means in normal case any user didnt used any page but logged in and refreshed the page then it automaticlly logged out in that case our touch interval is 24 hrs and touchafter is in terms of seconds 

  })
// no need to use again and pass the store in session directly pass in sessionOptions
store.on("error",()=>{
    console.log("Error in mongo-connect mongo session store "+error);

})
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
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
// app.get("/",(req,res)=>{
//     res.send("Hii I am root page!");
// })
app.use(session(sessionOptions));     
app.use(flash());
// using passports 
// passport use karne ke liye session ki jarurat hoti hai kyon ki ek bar login kiya toh sab jagaha login rahe use bar bar login karne ki jarurat na pade dure tab par bhi open kiya toh bhi oo login hi rahe
app.use(passport.initialize());//jab bhi koi passport aye toh oo initialize hoo
app.use(passport.session());//jabh bhi user ek page se dusre page par jaye toh jo req, res ki aa raha ja raha hai oo same hi user ke sath hoo.
// user ek hi session ke andar login karei bar bar use login karne ki jarurat nahi hai
passport.use(new LocalStatergy(User.authenticate()));
// passport ke through jab bhi koi user ayye toh localstatergy ke through authenticate hoo
// / use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());//jab bhi koi user related info store ho toh serialize form main hoo
passport.deserializeUser(User.deserializeUser());//user related info remove ho toh oo sab deserialize hoo

//after saving the listing it creates flash and redirect to /listings and then before sending responce it check middleware which declaered given below
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    // console.log(res.locals.success);//success is empty but it has no length
    // we cannot access req.user directly in ejs file but we need it while checking user is logged in or not hence we are using res.locals
    res.locals.currUser=req.user;//for using in navbar.ejs
    next();//in case if we forgot to call next then we are stuck here and next process is pending...
})


// app.get("/demoUser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"rishi@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser=await User.register(fakeUser,"rishi@13");//passing user details and password register is static method which returns save only if usename is unique
//     res.send(registeredUser);
// })



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// express se sirf url encoded data send kiya jayega
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
// use public folder
app.use(express.static(path.join(__dirname,"/public")));
// when restructuring
// 1 use here your imported file in common route like /listings is common route here it uses insted /
app.use("/listings",ListingsRouter);//jaha par Listings yete tithe Listings use karnar

app.use("/listings/:id/reviews",reviewsRouter);//listings id reviews ye parameter review main jayenge yaha se
app.use("/",userRouter);


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
