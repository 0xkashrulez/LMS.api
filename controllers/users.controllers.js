const Router = require("../routes/user.route");
const Users = require("../models/user.model");
const { handelstatus } = require("../utils/httpStatustext.js");
const apperror = require("../utils/apperror.js");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const generatJWT = require("../utils/generatJWT.js");

const getALLusers = async (req, res) => {
  const query = req.query;
  
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const users = await Users.find({}, { __v: false,password: false,token: false}).limit(limit).skip(skip);;
  res.json({ status: handelstatus.SUCCESS, data: { users } });
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const oldUser = await Users.findOne({ email: email });
    if (oldUser) {
      const error = apperror.create(
        "User already exists",
        400,
        handelstatus.FAILURE
      );
      return res.status(400).json({ message: error.message });
    }

    // Create a new user
    const newUser = new Users({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      avatar:req.file.filename
    });

    // Save the user
    await newUser.save();

    // Respond with success message
    return res.status(201).json({
      status: handelstatus.SUCCESS,
      data: { user: newUser },
    });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      const error = apperror.create(
        "Email and password are required",
        400,
        handelstatus.FAILURE
      );
      return res.status(400).json({ message: error.message });
    }

    // Find the user by email
    const user = await Users.findOne({ email: email });

    // If the user is not found
    if (!user) {
      const error = apperror.create(
        "User not found",
        404,
        handelstatus.FAILURE
      );
      return res.status(404).json({ message: error.message });
    }
  
    // Compare the provided password with the stored hashed password
    const matchedPassword = await bcrypt.compare(password, user.password);

    // If the password does not match
    if (!matchedPassword) {
      const error = apperror.create(
        "Invalid credentials",
        401,
        handelstatus.FAILURE
      );
      return res.status(401).json({ message: error.message });
    }

    // Login successful - You could return a token or other user data
    const token = await generatJWT({email:user.email,id:user._id,role:user.role});
   
    
    return res
      .status(200)
      .json({ status: handelstatus.SUCCESS,data:{token} });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getALLusers,
  register,
  login,
};
