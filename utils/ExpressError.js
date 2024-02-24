// created a class for handle errors
class ExpressError extends Error{
   constructor(statusCode,message)
   {
    super();
    this.statusCode=statusCode;
    this.message=message;
   }
}

// exports the class
module.exports=ExpressError;