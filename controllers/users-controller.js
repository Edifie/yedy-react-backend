const { v4: uuidv4 } = require("uuid"); //universally unique identifier generator
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

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

  const { name, email, password,image } = req.body;

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

  const createdUser = new User({
    name,
    email,
    password,
    image,
    pages: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed, please login instead.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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
      "Loggin in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credentials, could not login.", 401);
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

//Exports
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
