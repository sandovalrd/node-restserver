const express = require('express'); // npm install express --save
const mongoose = require("mongoose"); // npm install mongoose --save
const bodyParser = require('body-parser'); // npm install body-parser --save
const keys = require("./config/keys");
require('./models/User');
const app = express();
const port = process.env.PORT || 8080;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

require('./routes/userRoutes')(app);

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (req, res) => {
    if (req) {
        console.log('Base de datos OFFLINE');
    } else {
        console.log('Base de datos ONLINE');
    }
});


app.listen(port, () => {
    console.log('Escuchando puerto: ', port);
});