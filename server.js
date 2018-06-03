const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/xo";

const io = require('socket.io')(app.listen(process.env.PORT || 5555));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

MongoClient.connect(mongoUrl, {"useNewUrlParser": true}, (err, dbClient) => {

    if(err){
        console.log("error on db connect");
        return;
    }

    require('./sockets/sockets')(io,dbClient);
    require('./routes/index')(app);

});



