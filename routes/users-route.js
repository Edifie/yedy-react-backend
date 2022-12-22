const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controller");
const checkJwt = require("../middleware/checkJWT");
const router = express.Router();

router.get("/", usersControllers.getUsers);

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

router.get("/protected-route", checkJwt, (req, res) => {
  // The request object now has the user's ID available, thanks to the checkJwt middleware
  const userId = req.userId;

  // Do something with the user's ID here, such as fetching data from a database
  res.send({ message: "Successfully accessed protected route" });
});

module.exports = router;
