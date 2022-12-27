const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controller");
const router = express.Router();

router.get("/", usersControllers.getUsers);
router.get("/:uid", usersControllers.getUserById);

router.post(
  "/signup",
  [
    check("name")
      .not() // check if is not empty
      .isEmpty(),
    check("email")
      .normalizeEmail() //Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);
router.post("/login", usersControllers.login);

module.exports = router;
