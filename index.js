const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true, limit:"50mb"}));
    

require('./setup/db')()
require("./setup/routes")(app)
require('./setup/server')(app)
require("./setup/cors")(app);




