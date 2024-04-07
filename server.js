require('dotenv').config();
const connectdb = require('./config/connectdb');
const cloudinary = require('cloudinary');
//calling database connection function
connectdb();
const app = require('./app');
const Razorpay = require('razorpay');
const PORT = process.env.PORT || 5000;

//clodinary configuration
cloudinary.v2.config({
  cloud_name: 'dedllx1um',
  api_key: '331841568775566',
  api_secret: '3oY2Qm0AJfzxdcen86ciWcr-S3Y',
});
console.log();

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

