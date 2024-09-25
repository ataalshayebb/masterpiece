const mongoose = require('mongoose');
const { Schema } = mongoose;

const messagesSchema = new Schema({

    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
    content: { type: String, required: true}
 
},   { timestamps: true }
);

module.exports = mongoose.model('Messages', messagesSchema, 'messages');
