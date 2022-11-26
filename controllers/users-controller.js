const { v4: uuidv4 } = require("uuid"); //universally unique identifier generator
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const USERS = [
  {
    id: "u1",
    name: "dilan taskin",
    email: "test@gmail.com",
    password: "123",
  },
];

// Route to get all users
const getUsers = (req, res, next) => {
  res.json({ users: USERS });
};

// Route to signup
const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { name, email, password } = req.body;

  // check if the user's email already exists
  const hasUser = USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Could not create user, email already exists", 402);
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  USERS.push(createdUser);

  res.status(201).json("User created!");
};

// Route to login
const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifierUser = USERS.find((u) => u.email === email);
  if (!identifierUser || identifierUser.password !== password) {
    throw new HttpError(
      "Could not identify user, credentials seems to be wrong.",
      401
    );
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
