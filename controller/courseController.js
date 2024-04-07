const { createCipheriv } = require('crypto');
const Course = require('../model/course.model');
const AppError = require('../utility/appError');
const cloudinary = require('cloudinary');

const fs = require('fs');
exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select('-lectures');

    res.status(200).json({
      success: true,
      messsage: 'All Courses Loaded Successfully',
      courses,
    });
  } catch (e) {
    console.log('Error in retrieving all courses');
    console.log(e);
    return next(new AppError(`Error Occured: ${e.messsage}`, 400));
  }
};
exports.getLecturesByCourseId = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    res.status(200).json({
      message: 'All Lectures Loaded successsfully',
      success: true,
      lectures: course.lectures,
    });
  } catch (e) {
    console.log('Error in retrieving all Lectures');
    console.log(e);
    return next(new AppError(`Error Occured: ${e.messsage}`, 400));
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, category, createdBy } = req.body;
    if (!title || !description || !category || !createdBy) {
      return next(new AppError('All Fields are Required', 400));
    }
    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail: {
        public_id: 'dummy',
        secure_url: 'dummy',
      },
    });
    if (!course) {
      return next(new AppError('Course could not be created', 400));
    }

    //file uploaded
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
      });
      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
        fs.rm(`uploads/${req.file.filename}`, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
      await course.save();
      res.status(200).json({
        success: true,
        message: 'Course Created Successfully',
        course,
      });
    }
  } catch (e) {
    console.log(e);
    return next(new AppError('cannot create the course :(', 400));
  }
};
exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );

    if (!course) {
      return next(new AppError('Course could not be updated', 400));
    }
    res.status(200).json({
      success: true,
      message: 'Course Updated Successfully',
      course,
    });
  } catch (e) {
    console.log(e);
    return next(new AppError('cannot update the course :(', 400));
  }
};
exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError('Course could not be created', 400));
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Course deleted Successfully',
      course,
    });
  } catch (e) {
    console.log(e);
    return next(new AppError('cannot delete the course :(', 400));
  }
};

exports.addLectureToCoursebyId = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    if (!title || !description) {
      return next(new AppError('All Fields are Required', 400));
    }
    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError('Course does not exists', 400));
    }

    const lectureData = {
      title,
      description,
      lecture: {},
    };
    //file uploaded
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
        resource_type: "video", 
      });
      if (result) {
        lectureData.lecture.public_id = result.public_id;
        lectureData.lecture.secure_url = result.secure_url;

        fs.rm(`uploads/${req.file.filename}`, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
      course.lectures.push(lectureData);
      course.numberOfLectures = course.lectures.length;
      await course.save();
      res.status(200).json({
        success: true,
        message: 'Course Lectures added Successfully',
        course,
      });
    }
  } catch (e) {
    console.log(e);
    console.log('Problems faced in uploading lectures for course');
    return next(new AppError('cannot add the course :(', 400));
  }
};
