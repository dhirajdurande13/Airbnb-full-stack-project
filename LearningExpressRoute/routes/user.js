const express=require("express");
const router=express.Router();

// indedx for user
router.get("/",(req,res)=>{
    res.send("get request for user!");
})
// indedx id for user
router.get("/:id",(req,res)=>{
    res.send("get request id for user!");
})
// post for user
router.post("/",(req,res)=>{
    res.send("post request id for user!");
})
router.delete("/id",(req,res)=>{
    res.send("delete user");
})
module.exports=router;