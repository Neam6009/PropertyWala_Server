const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const mongoose = require("mongoose");
const userModel = require("../models/user_model");
const multer = require('multer');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const doenv = require("dotenv");

doenv.config({
  path: "./.env",
});

MongoDB_URI = process.env.MONGODB_URI;

mongoose.connect(MongoDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connected to MongoDB");
    // Now you can start using your mongoose models
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

exports.login = async (req, res) => {
  try {
    // Verify CSRF token
    csrfProtection(req, res, async () => {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.json({
          error: "Please Enter Your Email and Password",
        });
      }

      // check if the user exists
      const user = await userModel.User.findOne({ email: email });
      if (!user) {
        return res.json({
          error: "Email not registered, register first",
        });
      } else {
        if (!(await bcrypt.compare(password, user.password))) {
          return res.json({
            error: "Incorrect password!",
          });
        } else {
          const id = user._id;
          const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          console.log("The Token is " + token);
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("joes", token, cookieOptions);
          return res.status(200).json({
            user,
          });
        }
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};



exports.register = async (req, res) => {
  var lowerCaseLetters = /[a-z]/g;
  var upperCaseLetters = /[A-Z]/g;
  var numbers = /[0-9]/g;

  const { name, email, password } = req.body;

  if (
    !password.match(lowerCaseLetters) ||
    !password.match(upperCaseLetters) ||
    !password.match(numbers) ||
    password.length < 8
  ) {
    return res.json({
      error:
        "Password should contain lower case, upper case, number and minimum of length 8",
    });
  }
  try {
    // check if the user exists
    const user = await userModel.User.findOne({ email: email });
    if (user) {
      return res.json({
        error: "Email id already Taken",
      });
    }
  } catch (error) {
    res.status(400).json({ error });
  }

  let hashedPassword = await bcrypt.hash(password, 8);

  const user = await new userModel.User({
    name,
    email,
    password: hashedPassword,
    isAdmin: false,
    isCertified: false,
    wishlist: [],
  }).save();

  return res.status(200).json({
    msg: "You have registered now log in",
  });
};

exports.changePassword = async (req, res) => {
  console.log(req.body);
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;

  const user = await userModel.User.findById(userId);
  if (await bcrypt.compare(oldPassword, user.password)) {
    let hashedPassword = await bcrypt.hash(newPassword, 8);

    user.password = hashedPassword;
    user.save();
    res.json({ success: "your password has been successfully changed!" })
  } else {
    return res.json({ error: "please verify your old password" })
  }

}

exports.deleteUser = async (req, res) => {

  const password = req.body.password;
  const userId = req.body.userId;

  const user = await userModel.User.findById(userId);
  if (await bcrypt.compare(password, user.password)) {
    await user.deleteOne();
    return res.json({ success: "your account has been deleted!" });
  } else {
    return res.json({ error: "wrong password!" });
  }


}

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.joes) {
    try {
      const decode = await promisify(jwt.verify)(
        req.cookies.joes,
        process.env.JWT_SECRET
      );
      const user = await userModel.User.findOne({ _id: decode.id });
      if (!user) {
        return res.json({
          error: "No user logged in",
        });
      }
      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  } else {
    return;
  }
};
exports.logout = async (req, res) => {
  res.cookie("joes", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).send("Logout successful");
};

exports.wishlist = async (req, res) => {
  const userId = req.user.id;
  const propertyId = req.params.propertyId;
  const wishlist = req.user.wishlist;
  if (wishlist.includes(propertyId)) {
    userModel.User.findById(userId).then((user) => {
      const index = user.wishlist.indexOf(propertyId);
      user.wishlist.splice(index, 1);
      user.save();
    });
  } else {
    userModel.User.findById(userId).then((user) => {
      user.wishlist.push(propertyId);
      user.save();
    });
  }
  res.end();
};

exports.certified = async (req, res) => {
  const change = req.params.change;
  const userId = req.params.userId;

  userModel.User.findById(userId).then((user) => {
    user.isCertified = change === "true";
    user.save();

    console.log(user);
  });

  res.end();
};
exports.admin = async (req, res) => {
  const change = req.params.change;
  const userId = req.params.userId;
  console.log(change);

  userModel.User.findById(userId).then((user) => {
    user.isAdmin = change === "true";
    user.save();

    console.log(user);
  });

  res.end();
};


exports.deleteUserByAdmin = async (req, res) => {
  deleteUserId = req.body.deleteUserId;

  const user = await userModel.User.findById(deleteUserId);
  try {
    await user.deleteOne();
    return res.status(200).json({ success: "user account has been deleted!" });

  } catch (error) {
    res.status(401).json({ error: "there was an error deleting the account" })
  }

}

exports.setProfileImage = async (imgId, userId) => {
  const user = await userModel.User.findById(userId);
  user.profileImage = imgId;
  await user.save();

}

exports.getAllUsers = async (req, res) => {
  const users = await userModel.User.find(); //const users = await userModel.User.find({ _id: { $ne: req.user._id } });

  return res.status(200).json(users);
};
