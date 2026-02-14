const mongoose = require('mongoose');

URI = "mongodb://localhost:27017/AdminPanel";

mongoose.connect(URI).then(() => {
    console.log("MongoDB is Connected..");
}).catch((error) => {
    console.log("MongoDB is not Connected..", error);
});