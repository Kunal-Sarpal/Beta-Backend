const fbadmin = require('firebase-admin');
const serviceCredentials = require('../../brandsterCredentials.json');

fbadmin.initializeApp({
    credential: fbadmin.credential.cert(serviceCredentials),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
})


module.exports = fbadmin;