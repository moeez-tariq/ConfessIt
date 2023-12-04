import './db.mjs';
import mongoose from 'mongoose';
const DiaryEntry = mongoose.model('DiaryEntry');
const Confession = mongoose.model('Confession');

export class DiaryManager {
    constructor(diary) {
      this.diary = diary;
    }
  
    getSortedEntries() {
      return this.diary.entries.sort((a, b) => b.timestamp - a.timestamp);
    }
  
    addEntry(content) {
      const newEntry = new DiaryEntry({ content });
      this.diary.entries.push(newEntry);
      return this.diary.save();
    }
}

export class ConfessionManager {
    constructor(popField) {
      this.populateField = popField;
    }
  
    getAllConfessions() {
      return Confession.find().sort({ timestamp: -1 }).populate(this.populateField);
    }
  
    getUserConfessions(userId) {
      return this.confessions.filter(confession => confession.user.toString() === userId);
    }
  
    addConfession(user, content) {
      const newConfession = new Confession({ user, content });
      return newConfession.save();
    }

    async likeConfession(user, confessionId) {
        if (user.dislikedConfessions.includes(confessionId)) {
            const confession = await Confession.findById(confessionId);
            confession.likes += 1;
            confession.dislikes -= 1;
      
            await confession.save();
            user.dislikedConfessions = user.dislikedConfessions.filter(id => id.toString() !== confessionId);
            user.likedConfessions.push(confessionId);
      
            return user.save();
        }
      
        if (!user.likedConfessions.includes(confessionId)) {
            const confession = await Confession.findById(confessionId);
        
            confession.likes += 1;
            await confession.save();
            user.likedConfessions.push(confessionId);
            return user.save();
        }
    }

    async dislikeConfession(user, confessionId) {
        if (user.likedConfessions.includes(confessionId)) {
            const confession = await Confession.findById(confessionId);
            confession.likes -= 1;
            confession.dislikes += 1;
      
            await confession.save();
      
            user.likedConfessions = user.likedConfessions.filter(id => id.toString() !== confessionId);
            user.dislikedConfessions.push(confessionId);
      
            return user.save();
          }
      
          if (!user.dislikedConfessions.includes(confessionId)) {
            const confession = await Confession.findById(confessionId);
      
            confession.dislikes += 1;
      
            await confession.save();
            user.dislikedConfessions.push(confessionId);
            return user.save();
        }
    }
}