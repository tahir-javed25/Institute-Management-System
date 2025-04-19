import jwt from "jsonwebtoken";
export const checkAuth = (req,res,next)=>{
    try {
        // we actually get and string having two things we are spliting it and getting the 2nd one which is the jwt token.... that's why splitt(" ")[1] 
        const token = req.headers.authorization.split(" ")[1]
        // console.log(token);
        const verify = jwt.verify(token, "keep it in .env file");
        // console.log(verify);
        next();
        //  this next means if everything is okay then move next from the CourseApi in course.js
    } 
    catch (error) {
        console.log(error)
        res.status(401).json({message: 'Error fetching courses'})    
    }
   

}