// const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

const registerUser = async (request, response) => {
  const { username, email, password, image } = request.body;

  if (!username || !email || !password) {
    response.status(400).send({
      message: "Please enter all required fields.",
      status: false,
    });
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    response.send({ message: "User already exists.", status: false });
  } else {
    bcrypt
      .hash(password, 10)
      .then((encryptPassword) => {
        const newUser = new User({
          username: username,
          email: email,
          password: encryptPassword,
          imageUrl: image,
          isActive: true,
        });
        newUser
          .save()
          .then((result) => {
            response.status(201).json({
              message: "User Created Successfully.",
              _id: result._id,
              username: result.username,
              email: result.email,
              imageUrl: result.imageUrl,
              isAdmin: result.isAdmin,
              isActive: result.isActive,
              token: generateToken(result._id),
              status: true,
            });
          })
          .catch(() => {
            response.status(400).send({
              message: "Failed to Create the User.",
              status: false,
            });
          });
      })
      .catch(() => {
        response.status(500).send({
          message: "Password was not encrypted successfully.",
          status: false,
        });
      });
  }
};

const authUser = (request, response) => {
  const { email, password } = request.body;
  User.findOne({ email })
    .then((user) => {
      bcrypt.compare(password, user.password).then((passwordVerification) => {
        if (!passwordVerification) {
          response.status(400).send({
            message: "Passwords does not match.",
            status: false,
          });
        } else {
          response.status(200).send({
            message: "Login Successful",
            _id: user._id,
            username: user.username,
            email: user.email,
            imageUrl: user.imageUrl,
            isAdmin: user.isAdmin,
            isActive: true,
            token: generateToken(user._id),
            status: true,
          });
        }
      });
    })
    .catch((error) => {
      response.status(404).send({
        message: "Email not found.",
        status: false,
      });
    });
};

const allUsers = async (request, response) => {
  const { email, password } = request.body;
  const keyword = request.query.search
    ? {
        $or: [
          { username: { $regex: request.query.search, $options: "i" } },
          { email: { $regex: request.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({
    _id: { $ne: request.user._id },
  });

  response.send(users);
};

const updateUserStatus = async (request, response) => {
  const { userId, isActive } = request.body;

  const updateUserInfo = await User.findByIdAndUpdate(
    userId,
    {
      isActive: isActive,
    },
    {
      new: true,
    }
  );

  if (!updateUserInfo) {
    response.status(404).send({
      message: "User Not Found",
    });
  } else {
    response.json(updateUserInfo);
  }
};

module.exports = { registerUser, authUser, allUsers, updateUserStatus };
