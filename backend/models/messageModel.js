const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        message :{
            type:String,
            required:true,
        },
        sender:{
            type: Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },    
        chat: {
            type: Schema.Types.ObjectId,
            ref:"Chat",
        }
    },
    {
        timestamps:true,
    },
    
);

module.exports = mongoose.model('Message',messageSchema);