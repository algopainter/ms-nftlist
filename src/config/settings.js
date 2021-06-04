import dotenv from 'dotenv';

dotenv.config();

/* .env
MONGO_URL
MONGO_DEBUG_MODE
*/

export default {
  db: {
    mongoUrl: process.env.MONGO_URL,
    debug: process.env.MONGO_DEBUG_MODE,
  },
};
