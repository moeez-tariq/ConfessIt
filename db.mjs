const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  diary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Diary',
  },
  confessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Confession',
    },
  ],
});

// Diary Entry Schema
const DiaryEntrySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Diary Schema
const DiarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  entries: [DiaryEntrySchema],
});

// Confession Schema
const ConfessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
});

mongoose.model('User', UserSchema);
mongoose.model('Diary', DiarySchema);
mongoose.model('Confession', ConfessionSchema);