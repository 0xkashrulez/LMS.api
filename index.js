require('dotenv').config()
const corusesRouter = require("./routes/courses.route");
const usersRouter = require("./routes/user.route");
const express = require("express");
const cors=require("cors");
const path=require('path')
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const mongoose=require('mongoose');
const { handelstatus } = require('./utils/httpStatustext');
const { error } = require('jsend');
const url=process.env.MONGO_URL
const connectDB = async () => {
    try {
      await mongoose.connect(url, {
     //   useNewUrlParser: true,
    // useUnifiedTopology: true
      });
      console.log('MongoDB connected...');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };
  // Connect Database
connectDB();

app.use(express.json()); //or (bodyparser.json())

app.use(cors())

app.use("/api/courses", corusesRouter);

app.use('/api/users', usersRouter);

//CRUD==>{create,read,update,delete} => API operation
// global middlewire for not found router
app.all('*',(req,res,next)=>{
    res.status(404).json({ status: handelstatus.ERROR,Message: "this resours is not available"});
})
// gobal error handeler
app.use((error, req, res, next) => { 
    res.status(error.statuscode ||500).json({
      status: error.statustxt||handelstatus.ERROR,message: error.message});
      
  });

app.listen( process.env.PORT||5001, () => {
   // console.log("listening on port: 5001");
});
