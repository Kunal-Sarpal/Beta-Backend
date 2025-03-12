const multer = require('multer');
const FirebaseStorage = require('multer-firebase-storage');
const serviceCredentials = require("../brandsterCredentials.json");

const fbadmin = require('./firebase.config');

const storage = FirebaseStorage({
    bucketName: process.env.FIREBASE_STORAGE_BUCKET,
    credentials: fbadmin.credential.cert(serviceCredentials),
    unique: true,
    public: true

})
const upload = multer({ storage: storage });

module.exports = upload;