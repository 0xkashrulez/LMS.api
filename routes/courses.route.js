const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const courseController = require("../controllers/courses.controllers"); // Ensure this path is correct
const { validationSchema } = require("../middlewares/validationSchema");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require('../middlewares/allowedTo');
const userRole = require('../utils/userRoles')

 router.route('/')
            .get(verifyToken,courseController.getAllCourse)
            .post(verifyToken,allowedTo(userRole.ADMIN,userRole.MANGER),validationSchema(), courseController.AddCourse);



  router.route('/:courseID')
            .get(verifyToken,courseController.getCourse)
            .patch(verifyToken,allowedTo(userRole.ADMIN,userRole.MANGER),courseController.UpdateCourse)
            .delete(verifyToken,allowedTo(userRole.ADMIN,userRole.MANGER),courseController.DeleteCourse);

module.exports = router;

