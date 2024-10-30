import  mongoose,{Schema , Document} from 'mongoose';

export interface user extends Document{
    username : string,
    email : string,
    password : string,
    urls : string[]
}
const userSchema : Schema = new mongoose.Schema(
    {
        username : 
        {
            type : String,
            required : true,
        },
        email :
        {
            type : String,
            required : true,
        },
        password :
        {
            type : String,
            required : true,
        },
        urls : []
    },
)

const userModel = mongoose.model<user>('userModel',userSchema);

export default userModel