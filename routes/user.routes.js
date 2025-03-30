const express = require('express');
const router = express.Router();
const userModel = require('../models/user.models');
const { generateLoginToken ,checkLoginToken } = require('../middleware/generateLoginToken');


// Register route 
router.post('/register', async (req, res) => {
    try {
        const user = req.body;
        console.log("user",user);
        const existingUser = await userModel.findOne({ aadharCardNumber : user.aadharCardNumber });
        console.log("existingUser", existingUser);
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' });
        }
        const role = user.role ;
        if(role == 'admin' && (await userModel.findOne({role : 'admin'})))return res.status(400).send("You are not allowed to register as admin");
        const newUser = new userModel(user);
        await newUser.save();

        const payload = {
            id: newUser.id,
            name: newUser.name,
        }
        const token = await generateLoginToken(payload);
        console.log("token",token);
        res.status(200).send({ user: newUser, token })

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
)
// Login route
router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber , password } = req.body;
        if(!aadharCardNumber || !password)return res.status(400).send("Please provide aadharCardNumber and password");
        const user = await userModel.findOne({ aadharCardNumber });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
         const checkpass = await user.comparePassword(password);
         if(!checkpass)return res.status(400).send("invalid password");

        const payload = {
            id: user.id,
            name: user.name,
        }
        const token = await generateLoginToken(payload);
        res.status(200).send({ token:token });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
)
// Profile route
router.get('/profile',checkLoginToken, async (req, res) => {
    try{
        const user = req.user;
        if(!user)return res.status(401).send("Unauthorized");
        const userProfile = await userModel.findById(user.id);
        if(!userProfile)return res.status(404).send("User not found");
        res.status(200).send(userProfile);
    }catch(err){
        console.log("Error fetching user profile",err);
        res.status(500).send("Error while fetching user profile");
    }

})
// Update profile route
router.put('/update-passward',checkLoginToken, async (req, res) => {
    try{
        const user = req.user;
        if(!user)return res.status(401).send("Unauthorized");
        const {currentPassward , newPassward} = req.body;
        const userProfile = await userModel.findById(user.id);
        if(!userProfile)return res.status(404).send("User not found");
        const checkpass = await userProfile.comparePassword(currentPassward);
        if(!checkpass)return res.status(400).send("invalid password");
        userProfile.password = newPassward;
        await userProfile.save();
        res.status(200).send(userProfile);
    }catch(err){
        console.log("Error updating user profile",err);
        res.status(500).send("Error while updating user profile");
    }

})


module.exports = router;

