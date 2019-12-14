const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");

//router.post("/register", AuthController.CreateUser);
router.route("/register").post(AuthController.CreateUser);
router.route("/login").post(AuthController.LoginUser);

module.exports = router;
