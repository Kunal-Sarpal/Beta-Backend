const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const userRouter = require("./Routes/user");  // Corrected import
const creatorRoute = require("./Routes/creator");  // Ensure correct import

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const mongoURI = 'mongodb+srv://sarpalkunal8:kunal30@cluster0.jbugw.mongodb.net/Startup'; 
const mongoURI = 'mongodb://localhost:27017/Startup1';

app.use("/api/v1/user", userRouter);
app.use("/api/v1/creator", creatorRoute);

mongoose.connect(mongoURI, {})
    .then(() => {
        console.log('Successfully connected to MongoDB database');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const port = 3000;

app.get('/', (req, res) => {
    res.send('MongoDB connection established, server is running.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
