const User = require("../models/User");


const authinticateSocket=(authorizedOnly=true)=>async(socket,next)=>{
    try{
        if(!authorizedOnly){
            return next();
        }
        const userId=socket.handshake.auth?.userId;
        if(!userId){
            const error=new Error("Unauthorized access");
            error.code=403;
            error.data={content:'Invalid userId or userId not found'};
            return next(error);
        }
        const user=await User.findById(userId);
        if (!user) {
            const error=new Error("Unauthorized access");
            error.code=403;
            error.data={content:'Invalid userId or userId not found'};
            return next(error);
        }
        socket.user={
            id:user.id,
            name:user.name,
            email:user.email,
            fullName:user.fullName,
            role:user.role
        }
        next();
    }catch(err){
        next(err);
    }
}
module.exports=authinticateSocket;