let mongoose = require('mongoose');

// create a model class
let businessModel = mongoose.Schema({
    name: String,
    number: String,
    email: String
    
},
{
    collection: "business"
});

module.exports = mongoose.model('business', businessModel);