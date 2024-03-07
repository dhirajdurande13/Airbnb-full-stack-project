const passport=require("passport")
const User = require("../models/user.js");

module.exports.renderSignupForm=(req, res) => {
    // thise request for going and and render the form
    res.render("user/signup.ejs");
}
module.exports.signup=async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        // jab bhi hum signup karte hai toh automatically login ho jana chahiye
        req.login(registeredUser,(err)=>{
            if(err)
            {
               return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings"); 
            
        })
        // req.flash("success", "Welcome to Wanderlust!");
        // res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    // if try catch not write error gives by wrapsync A user with the given username is already registered and goes to page not found error
}

module.exports.renderLoginForm=(req, res) => {
    // thise request for going and and render the form
    res.render("user/login.ejs");
}

module.exports.login=async (req, res) => {
    // passport check karega oo present hai yaa nahi but oo ek middleware ki taraha kam karta hai passport.authenticate main 'local' jo hai oo statergy.
    // agar middleware succesesfully kam karta hai tabhi age ka async kam karega in case failure hua toh redirect kar ke login par jayenge
    // failure flash joo error aya hai oo flash karain
    req.flash("success","Welcome to wanderlust!");
    // res.redirect("/listings");

    // yaha ek flaw hai agar hum directly login karte hai toh saveredirecturl main undefinde ayega kyon ki kabhi isLoggedin middleware call hi nahi hogi
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{//logout implements passport
        // in logout fxn takes 1 call back if error occured it returns error and else empty 
        if(err)
        {
          return next(err);//prints error
        }
        req.flash("success","you are loged out!");
        res.redirect("/listings");
    })

}