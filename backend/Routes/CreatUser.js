const express = require("express");
const router = express.Router();
const User = require("../models/User");

const { body, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = "HaHa";
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.password, salt);

    try {
      await User.create({
        name: req.body.name,
        password: securePass,
        email: req.body.email,
        location: req.body.location,
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    //     let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let email = req.body.email;
    try {
      let userData = await User.findOne({ email }); //{email:email} === {email}
      if (!userData) {
        return res
          .status(400)
          .json({ error: "Try Logging in with correct credentials" });
      }

      // if (req.body.password !== userData.password)
      //   return res
      //     .status(400)
      //     .json({ error: "Try Logging in with correct credentials" });

      const pwdCompare = await bcrypt.compare(
        req.body.password,
        userData.password
      ); // this return true false.
      if (!pwdCompare) {
        return res
          .status(400)
          .json({ error: "Try Logging in with correct credentials" });
      }
      const data = {
        user: {
          id: userData.id,
        },
      };
      //       success = true;
      const authToken = jwt.sign(data, jwtSecret);
      return res.json({ success: true, authToken: authToken });

      // return res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

module.exports = router;
