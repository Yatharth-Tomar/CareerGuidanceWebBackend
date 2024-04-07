const { model, Schema } = require('mongoose');
const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxLength: [100, 'Title should be less than 60 characters'],
    },
    description: {
      type: String,
      minLength: [10, 'description should be at least of 10 characters'],
      maxLength: [500, 'Only 200 characters allowed in description'],
    },
    category: {
      type: String,
      required: [true, 'Category id required'],
    },
    thumbnail: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    lectures: [
      {
        title: String,
        description: String,
        lecture: {
          public_id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      },
    ],
    numberOfLectures: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Course', courseSchema);
