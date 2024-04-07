const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = mongoose.Schema(
  {
    fullName: {
      type: "String",
      required: [true, "Name is required"],
      trim: true,
      minLength: [4, "Name should be of atleast 4 letters"],
    },
    email: {
      type: "String",
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      trim: true,
      //we can add regex also here
    },
    password: {
      type: "String",
      required: [true, "Password is required"],
      minLength: [8, "Password must be atleast 8 character"],
      select: false, //DOnt give password by default on request, only when explicitly demanded
    },
    avatar: {
      public_id: {
        type: "String",
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: "String",
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    // skills here
    userSkills: {
      type: Array,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
      id: String,
      status: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods = {
  async generateJWTToken() {
    return await jwt.sign(
      {
        id: this._id,
        email: this.email,
        subscription: this.subscription,
        role: this.role,
      },
      process.env.SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },
  async comparePassword(plainTextPassword) {
    console.log(plainTextPassword);
    console.log(this.password);
    return await bcrypt.compare(plainTextPassword, this.password);
  },
  async generePasswordRestToken() {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; //15 minutes from now
    return resetToken;
  },
};

module.exports = mongoose.model("User", userSchema);
