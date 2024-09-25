const mongoose = require('mongoose');
const { Schema } = mongoose;

const usersSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  phonenumber: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['tawjihi', 'bachelors', 'masters'], 
    default: 'tawjihi' 
  },
  city: { type: String, 
    enum: ['zarqa', 'amman', 'aqaba','irbid','mafraq','maan','ajloun'], 
   },
  bio: { type: String },
  image: { type: String },
  title: { type: String },
  friends: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    isFriend: { type: Boolean, default: false }
  }],
  isSubscribed: { type: Boolean, default: false }
 
  
});

module.exports = mongoose.model('Users', usersSchema, 'users');
