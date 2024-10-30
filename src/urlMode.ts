import  mongoose,{Schema , Document} from 'mongoose';

type visit = {
    timestamp : number,
}

interface url extends Document{
    id : number,
    redirecteUrl : string,
    visitHistory : visit[],
    createdBy : mongoose.Schema.Types.ObjectId,
}
var urlSchema : Schema = new mongoose.Schema(
    {
        id : {
            type : String,
            unique : true,
        },
        redirecteUrl : {
            type : String,
        },
        visitHistory : [{timestamp : {type : Number}}],
        createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'userModel'
        }
    }
);

const urlModel = mongoose.model<url>('urlModel',urlSchema);

export default urlModel

