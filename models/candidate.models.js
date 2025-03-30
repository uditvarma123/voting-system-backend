const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    votes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        votedAt: {
            type: Date,
            default: Date.now
        }
    }],
    voteCount : {   
        type : Number,
        default : 0
    },
    mobile: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;