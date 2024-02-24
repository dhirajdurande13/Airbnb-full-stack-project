const express=require("express");
const router=express.Router();


// indedx for post
router.get("/",(req,res)=>{
    res.send("get request for posts!");
})
// indedx id for posts
router.get("/:id",(req,res)=>{
    res.send("get request id for posts!");
})
// post for posts
router.post("/",(req,res)=>{
    res.send("post request id for posts!");
})
router.delete("/:id",(req,res)=>{
    res.send("delete posts");
})
module.exports=router;