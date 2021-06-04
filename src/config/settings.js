const dotenv = require('dotenv');

dotenv.config();

/* .env
  MONGO_URL
  MONGO_DEBUG_MODE
*/

module.exports = {
  db: {
    mongoUrl: process.env.MONGO_URL,
    debug: process.env.MONGO_DEBUG_MODE,
  },
};
