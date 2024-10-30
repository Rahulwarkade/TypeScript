
import userModel,{user} from './userModel.js';
import { Request,Response,NextFunction} from 'express';
import {customeReq} from './app.js'


const userMap = new Map<string,user>();

const setUser = (id:string,user:user):void=>{
    userMap.set(id,user);
}
const getUser = (id:string):user | undefined=>{
    return userMap.get(id);
}


const isAuthenticated = async (req: customeReq,res:Response,next:NextFunction)=>{
    
    const sessionId = req.cookies?.session;

    if(!sessionId) 
    {
        res.redirect("/login");
        return;
    }
    const currUser = getUser(sessionId);
    if(!currUser) {
        res.send("your are lougout")
        return;
    }
    req.user = currUser;
    next();
}

export {isAuthenticated,setUser,getUser}