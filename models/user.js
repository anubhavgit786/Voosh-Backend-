const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
{
    email:
    {
        type:String,
        required:true,
        unique :true
    },
    password:
    {
        type:String,
        select: false
    },
    firstname:
    {
        type:String,
        required:true 
    },
    lastname:
    {
        type:String,
        required:true 
    },
    googleId: String,
}, 
{
    timestamps: true
});

userSchema.pre('save', async function (next) 
{
    if (!this.isModified('password')) 
    {
      next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;