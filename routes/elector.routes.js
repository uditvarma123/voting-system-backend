const express = require('express');
const router = express.Router();
const candidateModel = require('../models/candidate.models');
const { checkLoginToken } = require('../middleware/generateLoginToken');

// functionalities 
// admin able to crete party 
// modify party 
// delete party 

router.post('/create-candidate',checkLoginToken,async (req,res)=>{
    try{
        const candidatedata = req.body;
        const admindata = req.user;
        if(admindata.role !== 'admin')return res.status(401).send("Admin not verified to create candidate");
        const existingCandidate = await candidateModel.findById(candidatedata.name);
        if(existingCandidate)return res.status(400).send("Candidate already exists");
        const newCandidate = new candidateModel(candidatedata);
        await newCandidate.save();
        res.status(200).send(newCandidate);
    }catch(err){
        console.log(err);
        res.status(500).send({message : err.message});
    }
})

router.put('/modify-candidate/:id',checkLoginToken,async (req,res)=>{   
    try{
        const candidatedata = req.body;
        const admindata = req.user;
        if(admindata.role !== 'admin')return res.status(401).send("Admin not verified to modify candidate");
        const existingCandidate = await candidateModel.findById(req.params.id);
        if(!existingCandidate)return res.status(400).send("Candidate not found");
        await candidateModel.findByIdAndUpdate(req.params.id,candidatedata);
        res.status(200).send({message : "Candidate modified successfully"});
    }catch(err){
        console.log(err);
        res.status(500).send({message : err.message});
    }
})
router.delete('/delete-candidate/:id',checkLoginToken,async (req,res)=>{
    try{
        const admindata = req.user;
        if(admindata.role !== 'admin')return res.status(401).send("Admin not verified to delete candidate");
        const existingCandidate = await candidateModel.findById(req.params.id);
        if(!existingCandidate)return res.status(400).send("Candidate not found");
        await candidateModel.findByIdAndDelete(req.params.id);
        res.status(200).send({message : "Candidate deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).send({message : err.message});
    }
})

// voting routes;
router.post('/vote/:id',checkLoginToken,async (req,res)=>{
    try{
        const user = req.user;
        if(user.isVoted)return res.status(400).send("You are already voted");
        const candidate = await candidateModel.findById(req.params.id);
        if(!candidate)return res.status(400).send("Candidate not found");
         candidate.votes.push({
            user :user.id,
            votedAt : new Date()
         })
        candidate.voteCount = candidate.voteCount + 1;
        await candidate.save();
        user.isVoted = true;
        await user.save();
        res.status(200).send({message : "Voted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).send({message : err.message});
    }
})
router.get('/get-votes/:id',checkLoginToken,async (req,res)=>{
    try{
        const admindata = req.user;
        if(admindata.role !== 'admin')return res.status(401).send("Admin not verified to get votes");
        const candidate = await candidateModel.findById(req.params.id);
        if(!candidate)return res.status(400).send("Candidate not found");
        res.status(200).send({votes : candidate.votes});
    }catch(err){
        console.log(err);
        res.status(500).send({message : err.message});
    }
})
router.get('/get-vote-counts',checkLoginToken , async (req,res)=>{
    try{
        const admindata = req.user;
        if(admindata.role !== 'admin')return res.status(401).send("Admin not verified to get votes");
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        res.status(200).send(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).send({message : err.message});
    }
})
//// Get List of all candidates with only name and party fields
router.get('/get-candidate-list',checkLoginToken,async (req,res)=>{
    try{
        const candidateList = await candidateModel.find().select('name party');
        res.status(200).send(candidateList);
    }catch(err){
        console.log(err);
        res.status(500).send({message : err.message});
    }
})
module.exports = router;