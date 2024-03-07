const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

// establising mongoose connection
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

// initilazing data 
const initDB=async()=>{
    // clean all data 
   await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({
    ...obj,owner:"65d9d41816536e75b7d4a18f"
   }))
   await Listing.insertMany(initData.data);
   console.log("data was initialized!");
}
initDB();