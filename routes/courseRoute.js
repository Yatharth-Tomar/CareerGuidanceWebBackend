const express = require('express');
const route = express.Router();
const { isLoggedIn } = require('../middleware/jwtAuth');
const upload = require('../middleware/multer.middleware');
const { authorizedRoles } = require('../middleware/jwtAuth');

const {
  getAllCourses,
  getLecturesByCourseId,
  updateCourse,
  deleteCourse,
  createCourse,
  addLectureToCoursebyId,
} = require('../controller/courseController');

route.get('/', getAllCourses);
route.post(
  '/',
  isLoggedIn,
  authorizedRoles('ADMIN'),
  upload.single('thumbnail'),
  createCourse
);
route.put('/:id', isLoggedIn, authorizedRoles('ADMIN'), updateCourse);
route.delete('/:id', isLoggedIn, authorizedRoles('ADMIN'), deleteCourse);
route.get('/:id', isLoggedIn, getLecturesByCourseId);
route.post(
  '/:id',
  isLoggedIn,
  authorizedRoles('ADMIN'),
  upload.single('lecture'),
  addLectureToCoursebyId
);

module.exports = route;
