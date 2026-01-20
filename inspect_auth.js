
require('dotenv').config();
const { auth } = require('./lib/auth');

(async () => {
    console.log('auth keys:', Object.keys(auth));
    if (auth.api) {
        console.log('auth.api keys:', Object.keys(auth.api));
    }
})();
