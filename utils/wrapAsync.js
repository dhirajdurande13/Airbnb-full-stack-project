// function wrapAsync(fn)
// {
//     return function(req,res,next)
//     {
//         fn(req,res,next).catch(next);//if error occured it will call to next
//     }
// }

//directly exports
module.exports=(fn)=>
{
    return (req,res,next)=>
    {
        fn(req,res,next).catch(next);//if error occured it will call to next
    }
}