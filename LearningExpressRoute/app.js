let express = require("express");
let session = require('express-session')
var flash = require('connect-flash');
let app = express();
let port = 3000;
// const users=require("./routes/user.js");
// const posts=require("./routes/posts.js");
// var cookieParser = require('cookie-parser');
// app.use(cookieParser("secratecode"));//using cookie parser and sending security code may be any string
// // sending signed cookie
// app.get("/getSignedCookie",(req,res)=>{
//     res.cookie("MADE-IN","INDIA",{signed:true});//sending signed cookie
//     res.send("signed cookie sent!");
// })
// app.get("/verify",(req,res)=>{
//     console.log(req.cookies);
//     res.send("verify");
// })





// app.get("/",(req,res)=>{
//     console.log(req.cookies);//it is not possible to print cookies directly hence we have to parse it
//     res.send("root request!");
// })
// app.get("/getcookie",(req,res)=>{
//     res.cookie("Greet","Hello");//in terms of name value pair
//     res.cookie("Made in","India");//in terms of name value pair
//     res.cookie("name","Rishi");
//     res.send("Cookies!");

// })
// app.get("/greet",(req,res)=>{
//     let {name="default name"}=req.cookies;
//     res.send(`Hii,${name}`);
// })
// app.use("/users",users);//jab bhi user request aye too use users main yane user.js main bhej doo
// app.use("/posts",posts);//jab bhi user request aye too use users main yane user.js main bhej doo


// app.use(session({secret:"Mysecretsuperstring",resave:false,saveUninitialized:true}));
// defining diffrent way
let sessionOptions = { 
                    secret: "Mysecretsuperstring",  
                    resave: false,
                     saveUninitialized: true 
                    };

app.use(session(sessionOptions));
app.use(flash());
const path=require("path");//you must have to use path
app.set("view engine","ejs");//for showing object
app.set("views",path.join(__dirname,"views"));
// app.get("/test",(req,res)=>{
//     res.send("test succesfull!");
// })
// app.get("/reqcount",(req,res)=>{//statless protocol main res same hota hai
//     if(req.session.count)
//     {
//         req.session.count++;//we are trynig to create this protocol gives a statfull flag 
//     }else{
//         req.session.count=1;//statfull protocol main changed responce ata hai
//     }
//     res.send(`you sent request oc ${req.session.count} counts`);
// })
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();//pahle yye execute hoga badme next call main heelo reequest jayegi
})
// register
app.get("/register",(req,res)=>{
    let {name="anamonous"}=req.query;
    // console.log(req.session);//it prints defaul variables
    // we can set default variable like res.session.count
    req.session.name=name;
    // console.log(req.session.name);
    if(req.session.name==="anamonous")
    {
        req.flash('error',"User not registerd!");
    }else{
        req.flash('success',"User registerd successfully!");
    }
    
    // res.send(name);
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    // res.send(`hello! ${req.session.name}`);
    // console.log(req.flash('success'));//we are printing key means it prints the user reg succesfully
    // res.render("page.ejs",{name:req.session.name,msg:req.flash('success')},)//render tyach req rseponce varti chalte redirect navin url create karte tyamule render use kele
    
    // using res.locals instead of sending while rendering
    // res.locals.successMsg=req.flash("success");
    // res.locals.errorMsg=req.flash("error");//it makes code bulky hence use thise in middlewares
    res.render("page.ejs",{name:req.session.name})
})


app.listen(port, () => {
    console.log("port 3000 is listining!");
})