import Mongoose from 'mongoose';
import Settings from '../config/settings.js';

export default class Context {
  static async connect() {
    return await Mongoose.connect(Settings.db.mongoUrl, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
  }
}