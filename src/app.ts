import * as dotenv from 'dotenv';
import express,{Request, Response} from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as path from 'path'
import {connectDatabase} from './connect.js';
import urlModel from './urlMode.js';
import userModel from './userModel.js';
import shortid = require('shortid');
import {isAuthenticated,setUser,getUser} from './auth'
dotenv.config()

connectDatabase(process.env.DATABASE_URL);
const app = express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/playground',(req: Request, res: Response)=>{
    res.render('playground',{nameOne:"Rahul Warkade",nameTwo:"Alpha monhito",nameThree : "Beta Gama",nameFour:"Ami lorem"});
})


export interface customeReq extends Request
{
    user?:{username:string,email:string,password:string,urls : string[]}
}
app.post('/shorturl',isAuthenticated,async (req:customeReq,res:Response)=>{

    const shortUrl = await urlModel.create({
        id : shortid.generate(),
        redirecteUrl : req.body.url,   
        visitHistory : []
    });

    if(!req.user)
    {
        res.redirect('login');
        return;
    }
    const mainUser = await userModel.findOne({email:req.user.email});
    if(!mainUser){
        res.redirect('login');
        return;
    }
    mainUser.urls.push(shortUrl.id);
    await mainUser.save();
    res.render('home',{urls : mainUser.urls});
})

app.get('/login',(req:Request,res:Response)=>{
    res.render('login');
})
app.get('/logup',(req:Request,res:Response)=>{
    res.render('signup');
})

app.post('/sigin',async (req:customeReq,res:Response)=>{
    
    const user  = await userModel.findOne({username : req.body.username,password:req.body.password});

    if(!user)
    {
        res.send('user not found');
        return;
    }
    req.user = user;
    const sessionId : string = shortid.generate(); 
    setUser(sessionId,user);
    res.cookie('session',sessionId);

    res.render('home',{urls : req.user.urls});
})
app.post('/signup',async (req:Request,res:Response)=>{

    const user = await userModel.create(
        {
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            urls : []
        }
    )

    if(user) res.render('login');
})
app.get('/home',isAuthenticated,(req:customeReq,res:Response)=>{
    res.render('home',{urls: req.user?.urls});
})

app.post('/:shortUrl',async (req:Request,res:Response)=>{

    const url = await urlModel.findOne({id:req.params.shortUrl});
    if(!url) {
        res.end("url is not found");
        return;
    }
    url.visitHistory.push({timestamp : Date.now()});
    await url.save();
    res.redirect(url.redirecteUrl);
})

app.get('/analytics/:shortUrl',async (req:Request,res:Response)=>{
    const url = await urlModel.findOne({id:req.params.shortUrl});
    if(!url){ 
        res.end("url is not found");
        return;
    }
    res.status(200).json({visits: url.visitHistory.length , original: url.redirecteUrl});
})


app.listen(process.env.PORT,()=>{console.log(`server is running on port : ${process.env.PORT}`)})