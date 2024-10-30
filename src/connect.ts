import * as mongoose from 'mongoose';

export const connectDatabase = async (url:any)=>{
    try{
        await mongoose.connect(url);
        console.log("Database Connection Established");
    }
    catch(err){
        console.log(err);
    }
}