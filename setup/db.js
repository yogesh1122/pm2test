const mongoose = require('mongoose');

module.exports = ()=>{
    mongoose.connect('mongodb://0.0.0.0:27017/PolicyDB')
    .then(()=>console.log('MongoDB connected successfully'))
    .catch( (e)=>{console.log('error occured ',e.message)})

}