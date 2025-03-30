const mongoose=require('mongoose');
require('dotenv').config();
const mongoURL=process.env.MONGO_URL;
 mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
 })
 const db=mongoose.connection;
 db.on('connected',()=>{
    console.log('connected to database');
 })
 db.on('disconnected',()=>{
    console.log('disconnected from the database');
 })
 db.on('error',(err)=>{
    console.log('mongodb connection err ',err);
 })

 module.exports=db;
