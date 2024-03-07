const listing=require("./models/listing");
const Review=require("./models/reviews.js");
const ExpressError=require("./utils/ExpressError.js");


// requiring schema validations file
const {listingSchema,reviewSchema}=require("./schema.js");
module.exports.isLoggedin=(req,res,next)=>{
   // console.log(req.path,"..",req.originalUrl);//original url stores whole path and req.path stores ki par jane se roka hai
    if(!req.isAuthenticated())//iss logic ko ya toh edit delete sab jagah coppy kar sakte hai yaa middleware ke through pass kar sakte hai
   {
      // hame req.originalurl ko tabhi store karvana hai jab user login nahi hai 
      req.session.redirectUrl=req.originalUrl;//req.session ki access har ek request ke pass hogi kabhi bhi redirect url ko access kar sakte hai
      req.flash("error","you must be loged in to create listing!");
     return res.redirect("/login");//ig we arre not returning it gives error  to avoid thise error use return in res.redirect

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
   }
   next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{

   if(req.session.redirectUrl)
   {
      res.locals.redirectUrl=req.session.redirectUrl;//jab hum login karte hai tab passport session ki value undefined set karta hai isliye locals ke undar yee save karna pada
   }
   next();
}
module.exports.isOwner=async(req,res,next)=>{
    // authorization set karne ke liye pahle find karenge aur jab logg in karne wala aur owner ek hi hai toh update karenge
    let {id}=req.params;
    let Listing=await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.currUser._id))
    {
     req.flash("error","you are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);//agar return nahi karte hai toh niche ke operations bhi perform ho jayenge
    }
    next();
}
module.exports.validateListing = (req, res, next) => {
   let { error } = listingSchema.validate(req.body);
   //  console.log(result);
   if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");//if in some cases error details or multiple errors are occured then for bundling the function of all errors in one errMsg
      throw new ExpressError(400, errMsg);//if error occured
   } else {
      next();
   }

}
module.exports.validateReview=(req,res,next)=>{
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
// for checking user is author of review or not
module.exports.isReviewAuthor=async(req,res,next)=>{
   // authorization set karne ke liye pahle find karenge aur jab logg in karne wala aur owner ek hi hai toh update karenge
   let {id,reviewId}=req.params;
   let review=await Review.findById(reviewId);
   if(!review.author._id.equals(res.locals.currUser._id))
   {
    req.flash("error","you are not the author of this review!");
   return res.redirect(`/listings/${id}`);//agar return nahi karte hai toh niche ke operations bhi perform ho jayenge
   }
   // agar yaha return nahi karenge toh niche ke operations bhi perform hone ki koshish karenge aur error genrate hoga
   next();
}