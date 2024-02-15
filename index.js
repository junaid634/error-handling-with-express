const express = require("express");
let app = express();
let path = require("path");
const mongoose = require("mongoose");
const mathod = require("method-override");
app.use(mathod("_method"));
app.listen(8080, ()=>{
    console.log("server is runing");
});

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
//------------error class
class newerr extends Error{
    constructor(status,message){
        super();
        this.status = status;
        this.message= message;
    }
};
// ------asyncWrap function to replace try and catch method
function asyncWrap(fn){//fn is the async function that we used in try catch methods
   //this function is called in line 55
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    };
}

//------------db connection

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
};

main().then(()=>{
    console.log("DB_Conected");
}).catch((err)=>{
    console.log(err);
});

//------------db schema

let Chat = require("./models/schema.js");

//--------------home page

app.get("/", (req, res)=>{
    // console.log(chats.find());
    res.send("welcome");
});

//--------------chat page
//-----------now i am replacing try and catch method by asyncWrap function
app.get("/chat", asyncWrap(async(req,res,next)=>{
//try and catch is replaced here
        let chats = await Chat.find();
        res.render("chat.ejs", {chats});
    
}));

//---------------new chat page

app.get("/chat/new", (req,res)=>{
    res.render("newchat.ejs");
});

//--------------get new data

app.post("/chat",async(req,res,next)=>{
    try{
    let data = req.body;
    if(data.from!="" & data.to!="" & data.msg!=""){//validation error handling 
    let chat1 = new Chat({from:`${data.from}`,msg:`${data.msg}`,to:`${data.to}`,tim:new Date()});
    chat1.save().then((r)=>console.log(r)).catch((err)=>console.log(err));
    res.redirect("/chat");
}
next(new newerr(450,"please enter some data in all fields"));
}catch(err){
    next(err);
}
});
//-------------edit page
app.get("/chat/:id/edit", async(req,res,next)=>{
    try{
    let {id} = req.params;
    // console.log(id);
    await Chat.findById(id).then((r)=>{
        res.render("edit.ejs", {r});
    }).catch((err)=>{console.log(err)});
    // console.log(person)
}catch(err){
    next(err);
}
});
//--------------update massage
app.patch("/chat/:id", async(req,res,next)=>{
    try{
    let{ msg1 } = req.body;
    let { id } = req.params;
    console.log(msg1);
    await Chat.findByIdAndUpdate(id, {msg:msg1} ,{new:true},{runValidators:true}).then((r)=>{
    }).catch((err)=>{console.log(err)});
 
        res.redirect("/chat");
    }catch(err){
        next(err);
    }
});

//-----------------delete request

app.delete("/chat/:id",async(req,res,next)=>{
    try{
    let { id } = req.params;
    console.log(id);
    await Chat.findByIdAndDelete(id).then((r)=>{
    }).catch((err)=>{console.log(err)});
    res.redirect("/chat");
}catch(err){
    next(err);
}
});
//-------error handling in async function
app.get("/chat/:id", async(req,res,next)=>{
    try{
    let { id } = req.params;
    console.log(id);
    let chat = await Chat.findById(id);
    console.log(chat);
    if(!chat){

        next(new newerr(405,"chat not found"));//custum error
    }
res.render("ed.ejs",{chat});
}catch(err){
    next(err);
}
})
//---------error handler middlewarre
app.use((err,req,res,next)=>{
    console.log("--------error-------");
    console.log(err.name)
    next(err);
});

app.use((err,req,res,next)=>{
    console.log("--------error-------");
    let { status=401 , message="error occored"} = err;
    res.status(status).send(message);
    next();
});



