const JWT=require("jsonwebtoken");
exports.userMiddleWare= (req,res,next)=>{
      try{
           let token=req.headers.authorization;
           if(token)
           {
               token=token.split(" ")[1];
               let user=JWT.verify(token,process.env.SECRET)
               req.user=user.id;
               next();
           }
           else{
               res.status(401).json({
                   message:"unauthorized user"
               })
           }
      }
      catch(error)
      {
        res.status(401).json({
            message:"unauthorized user"
        })
      }
}