// for implementing login signup
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js")
const userController=require("../controllers/user.js")
// combing same request code
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)
// code shifted in router.route
// router.get("/signup", userController.renderSignupForm)
// router.post("/signup", wrapAsync(userController.signup));
// login
// code shifted in router.route
// router.get("/login", userController.renderLoginForm)
// saveredirecturl middleware session ke under ke original path ko locals ke under save karayegi
// router.post("/login",saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)
// implementing log out
router.get("/logout",userController.logout)
module.exports = router;