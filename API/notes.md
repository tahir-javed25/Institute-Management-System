to send the files from frontend to backend we can't directly send it, we have to use the fileUpload from the express-fielUpload.

# body-parser

and other thing is that we have to store the images somewhere so we will store them into the cloud, and this cloud is cloudinary. we have to make our account on the cloudinary and after that we have to install cloudinary's npm library, 

the code to upload a file on cloudinary is 
 cloudinary.uploader.upload(req.files.image.tempFilePath, (err,result)=>{
   if(!err){
    console.log("image uploaded",result);
}else{
    console.error(err)
}
   })

after uploading the picture it gives us an object in that object we have url, secure_url and id of that picture, so we can easily access that picture now through the result.secure_url.

Now to store the data of user we need database for that we will use mongoose, and there will make database