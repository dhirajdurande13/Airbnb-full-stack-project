const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// cloudinary ko backend ke sath jod na aisa code jo enviornment ke variables yaha pass karenge
cloudinary.config({
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.CLOUD_API_KEY,
        api_secret:process.env.CLOUD_API_SECRET
});
// names in the config are fixed like cloud_name api_key

// defining cloud storage 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdFormats: ["png","jpg","jpeg"], // supports promises as well
    },
  });

  module.exports={
    cloudinary,storage
  }
//   exports two things which are cloudinary and storage