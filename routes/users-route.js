const express = require("express");
const { check } = require("express-validator");
const multer = require("multer");

const usersControllers = require("../controllers/users-controller");
const store = require("../middleware/multer");
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

router.patch(
  "/:uid/profile-picture",
  store.any(),
  usersControllers.uploadImage
);

module.exports = router;
