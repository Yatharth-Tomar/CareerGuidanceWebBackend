const mongoose = require('mongoose');
mongoose.set('strictQuery', false); //to not give error on extra or wrong query and ignore it

const URL = process.env.URL;
const connectdb = async () => {
  try {
    await mongoose.connect(URL);
    console.log('Database Connection Succesfull');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectdb;
