const server = require("express");
const app = server();
const db = require('./dbConnection.js');
require('dotenv').config();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//healthcheck route for the service 
app.get('/' , async (req,res)=>{
    res.send("Welcome to Voting System");
});

const userRoutes = require('./routes/user.routes');
const electorRoutes = require('./routes/elector.routes');

app.use('/user',userRoutes);
app.use('/elector',electorRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
})

