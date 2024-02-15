const mongoose = require("mongoose");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
};
main().then(()=>{
    console.log("DB_Conected");
}).catch((err)=>{
    console.log(err);
});
let Chat = require("./models/schema.js");

Chat.insertMany([
    {
        from:"khan",
        to:"baloch",
        msg:"give me this pen",
        tim: new Date() 
    },
    {
        from:"khan",
        to:"baloch",
        msg:"i love you",
        tim: new Date() 
    },
    {
        from:"baloch",
        to:"zeshan",
        msg:"time is money",
        tim: new Date() 
    },
    {
        from:"junaid",
        to:"khan",
        msg:"time is far grater then money",
        tim: new Date() 
    },
    {
        from:"saqib",
        to:"ali",
        msg:"i hate progamming",
        tim: new Date() 
    },

])
