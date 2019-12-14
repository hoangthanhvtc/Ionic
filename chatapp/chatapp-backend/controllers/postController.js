const Joi = require("joi");
const HttpStatus = require("http-status-codes");

const Post = require("../models/postModels");
const User = require("../models/userModels");

module.exports = {
  AddPost(req, res) {
    const schema = Joi.object().keys({
      post: Joi.string().required()
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }
    const body = {
      user: req.user._id,
      username: req.user.username,
      post: value.post,
      created: new Date()
    };
    Post.create(body)
      .then(async post => {
        await User.update(
          { _id: req.user._id },
          {
            $push: {
              posts: {
                postId: post._id,
                post: post.post,
                created: post.created
              }
            }
          }
        );

        res.status(HttpStatus.OK).json({ message: "Post đã tạo", post });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Lỗi post!" });
      });
  },

  async GetAllPosts(req, res) {
    try {
      const posts = await Post.find({})
        .populate("user")
        .sort({ created: -1 });
      return res.status(HttpStatus.OK).json({ message: "Toàn bộ bài:", posts });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Xẩy ra lỗi!" });
    }
  },

  async AddLike(req, res) {
    const postId = req.body._id;
    await Post.update(
      {
        _id: postId,
        "likes.username": { $ne: req.user.username }
      },
      {
        $push: {
          likes: {
            username: req.user.username
          }
        },
        $inc: { totalLikes: 1 }
      }
    )
      .then(() => {
        res.status(HttpStatus.OK).json({ message: "You liked the post" });
      })
      .catch(err =>
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Xẩy ra lỗi!" })
      );
  }
};
