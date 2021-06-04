const Mongoose = require('mongoose');
const Settings = require('../config/settings.js');

module.exports = class Context {
  static async connect() {
    return await Mongoose.connect(Settings.db.mongoUrl, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
  }
}