
import userModel,{user} from './userModel.js';
import { Request,Response,NextFunction} from 'express';
import {customeReq} from './app.js'
import jwt,{JwtPayload} from 'jsonwebtoken';


const secret = 'rahul'

const setUser = (user:user)=>{
    return jwt.sign({username:user.username,email:user.email,password:user.password},secret);
}
const getUser = (token:string) : string|JwtPayload=>{
  return jwt.verify(token,secret);
}


const isAuthenticated = async (req: customeReq,res:Response,next:NextFunction)=>{
    
    const token = req.cookies?.token;

    if(!token) 
    {
        res.redirect("/login");
        return;
    }
    
    const currUser = jwt.verify(token,secret);
    if(!currUser) {
        res.send("your are lougout")
        return;
    }

    next();
}

export {isAuthenticated,setUser,getUser}