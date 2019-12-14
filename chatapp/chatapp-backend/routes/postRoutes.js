const express = require("express");
const router = express.Router();

const PostController = require("../controllers/postController");
const AuthHelper = require("../helpers/authHelper");

//router.post("/register", AuthController.CreateUser);
router.route("/posts").get(AuthHelper.VerifyToken, PostController.GetAllPosts);
router
  .route("/post/add-post")
  .post(AuthHelper.VerifyToken, PostController.AddPost);
router
  .route("/post/add-like")
  .post(AuthHelper.VerifyToken, PostController.AddLike);
module.exports = router;
