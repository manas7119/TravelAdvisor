const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const app = express();
const pinRoute = require('./routes');
const userRoute = require('./routes/users');

dotenv.config();

app.use(express.json());




mongoose
.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then( () =>  {
    console.log('connection successful');
})
.catch( (err) => {
    console.log(err);
    console.log('connection error')

});

app.use("/api/users", userRoute);

app.use("/api/pins/", pinRoute);

app.listen(8800, () => {
    console.log('server is listening');
});