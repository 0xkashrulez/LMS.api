const Course = require("../models/course.model");
const { handelstatus } = require("../utils/httpStatustext");
const { validationResult } = require("express-validator");
const apperror = require("../utils/apperror");
const jwt=require("jsonwebtoken");
const generatJWT = require("../utils/generatJWT.js");

const getAllCourse = async (req, res, next) => {
  try {
    const query = req.query;
    const limit = parseInt(query.limit, 10) || 10;
    const page = parseInt(query.page, 10) || 1;
    const skip = (page - 1) * limit;

    const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
    res.json({ status: handelstatus.SUCCESS, data: { courses }});
  } catch (err) {
    next(err);
  }
};

const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseID);

    if (!course) {
      return next(apperror.create("Course not found", 404, handelstatus.FAILURE));
    }

    return res.json({ status: handelstatus.SUCCESS, data: { course } });
  } catch (err) {
    next(err);
  }
};

const AddCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(apperror.create("Validation failed", 400, handelstatus.FAILURE));
    }

    const newCourse = new Course(req.body);
    await newCourse.save();

    res.status(201).json({ status: handelstatus.SUCCESS, data: { Course: newCourse } });
  } catch (err) {
    next(err);
  }
};

const UpdateCourse = async (req, res, next) => {
  try {
    const updatedCourse = await Course.updateOne(
      { _id: req.params.courseID },
      { $set: { ...req.body } }
    );

    if (!updatedCourse.matchedCount) {
      return next(apperror.create("Course not found", 404, handelstatus.FAILURE));
    }

    return res.status(200).json({ status: handelstatus.SUCCESS, data: { Course: updatedCourse } });
  } catch (err) {
    next(err);
  }
};

const DeleteCourse = async (req, res, next) => {
  try {
    const result = await Course.deleteOne({ _id: req.params.courseID });

    if (!result.deletedCount) {
      return next(apperror.create("Course not found", 404, handelstatus.FAILURE));
    }

    res.status(200).json({ status: handelstatus.SUCCESS, data: null });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCourse,
  getCourse,
  AddCourse,
  UpdateCourse,
  DeleteCourse,
};
