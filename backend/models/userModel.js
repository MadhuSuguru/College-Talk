
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type :String,
        required : true,
        min : 3,
        max : 10,
        unique: true
    },
    email : {
        type: String,
        required:true,
        unique: true,
        max: 50
    },

    password : {
        type :String,
        required:true,
        min :8
    },
    college: {
        type: String,
        required:true,
    },
    dp : {
        type: String,
        default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
    },
},
    {
        timestamps: true,
})

userSchema.methods.matchPassword = async function (pass) {
    return await bcrypt.compare(pass, this.password);
}

userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 12);
})
module.exports = new mongoose.model('User',userSchema);