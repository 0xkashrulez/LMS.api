const mongoose = require('mongoose');

// Define a schema (notice the capital 'S' in Schema)
const courseSchema = new mongoose.Schema({
  title: { type: String, 
           required: true 
         },
 
  price: { type: Number, 
           required: true 
         },
});

// Create a model
module.exports = mongoose.model('Course', courseSchema);


