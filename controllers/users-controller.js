const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");


const HttpError = require("../models/http-error");
const User = require("../models/user");

/*********************************************** GET USER BY ID ***********************************************/
// GET http://localhost:8080/api/users/:uid
const getUserById = async (req, res, next) => {
  const userId = req.params.uid; // {uid: 'u1'}
  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      // this error will display if our get request generally has some kind of a problem
      "Something went wrong, could not find a user with that ID.",
      500
    );
    return next(error);
  }

  // this error will display if the get request it's okay but don't have an id in the database
  if (!user) {
    // HttpError(messsage, status code)
    const error = new HttpError(
      "Could not find a user for the provided id.",
      404
    );
    return next(error);
  }

  // to get rid of _id in the mongoDB
  res.json({ user: user.toObject({ getters: true }) });
};

/*********************************************** GET ALL USERS ***********************************************/
// GET http://localhost:8080/api/users/
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // find everyting but password
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try it later.",
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

/*********************************************** SIGNUP ***********************************************/
// POST http://localhost:8080/api/users/signup
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password, location, phoneNumber } = req.body;


  // findOne() -> simply finds one document matching the criteria in the argument of our method.
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again later.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    location,
    phoneNumber,
    images: [],
    pages: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed, please login instead.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "harry-potter",
      { expiresIn: "3h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

/*********************************************** LOGIN ***********************************************/
// POST http://localhost:8080/api/users/login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let token;
  try {
    // Use a secret phrase to sign the JWT token
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "3h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

/*********************************************** UPLOAD PICTURE ***********************************************/
// PATCH http://localhost:8080/api/users/:uid/profile-picture

const uploadImage = (req, res, next) => {
  const userId = req.params.uid;
  const files = req.files;

  const { name, email, password, location, phoneNumber } = req.body;

  const updates = {};

  if (email) {
    updates.email = email;
  }
  if (password) {
    updates.password = password;
  }
  if (name) {
    updates.name = name;
  }

  if (location) {
    updates.location = location;
  }

  if (phoneNumber) {
    updates.phoneNumber = phoneNumber;
  }

  console.log("updated object", updates);

  if (files && files.length > 0) {
    updates.images = [];

    files.forEach((file, index) => {
      let img = fs.readFileSync(file.path);
      let encode_image = img.toString("base64");

      updates.images.push({
        filename: file.originalname,
        contentType: file.mimetype,
        imageBase64: encode_image,
      });
    });
  }

  User.findByIdAndUpdate(userId, updates)
    .then(() => {
      res.status(200).json({ message: "Template updated successfully!" });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

//Exports
exports.login = login;
exports.getUsers = getUsers;
exports.signup = signup;
exports.getUserById = getUserById;
exports.uploadImage = uploadImage;
