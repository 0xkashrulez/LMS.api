const mongoose =require("mongoose");
const validator = require("validator");
const userRole = require("../utils/userRoles");
const userSchema =new mongoose.Schema({
    firstName:{
        type:String,
        require:true

      },
    lastName:{
        type:String,
        require:true

      },
    email:{
        type:String,
        require:true,
        unique:true,
        validate:[validator.isEmail,'filed must be a valid email address']

      },
      password:{
        type:String,
        require:true
      
      },
      role:{
        type:String,//[USER,MANGER,ADMIN]
        enum:[userRole.USER,userRole.ADMIN,userRole.MANGER],
        default:userRole.USER

      },
      avatar:{
        type:String,
        default:'uploads/profile.png'  
      }
      
})

module.exports=mongoose.model('User',userSchema);