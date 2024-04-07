const path = require('path');
const multer = require('multer');
const AppError = require('../utility/appError');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, //50 mb in size
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    },
  }),

  //cb is a callback function with two parameters

  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname); //gives the extension of file
    if (
      ext !== '.jpg' &&
      ext !== '.jpeg' &&
      ext !== '.webp' &&
      ext !== '.png' &&
      ext !== '.mp4'
    ) {
      cb(new Error(`unsupported file type! ${ext}`, false));
      return;
    }
    cb(null, true);
  },
});

module.exports = upload;
