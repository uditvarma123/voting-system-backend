const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    aadharCardNumber :{
        type: Number,
        required: true,
        unique : true
    },
    role :{
        type: String,
        enum : ['admin','user'],
        default : 'user'
    },
    date: {
        type: Date,
        default: Date.now
    },
    isVoted : {
        type: Boolean,
        default : false
    }
})
// middleware to hash the paasword ;
userSchema.pre('save', async function (next) {
    const user = this;
    if(!user.isModified('password'))next();
    try{
        //generate salt 
     const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
    }catch(err){
        console.log(err);
        next(err);
    }
})
// middleware to compare the password ;
userSchema.methods.comparePassword = async function (password) {
    const user = this;
    const ans = await bcrypt.compare(password, user.password);
    return ans ;
}
const User = mongoose.model('User', userSchema);
module.exports = User;