const Joi = require("joi");
const HttpStatus = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Helpers = require("../helpers/helpers");
const User = require("../models/userModels");
const dbConfig = require("../config/link");

module.exports = {
  //Noi dung CreateUser: 1 kiem tra req.body bằng joi các giá trị hợp lệ - 2 Nếu hợp lệ thì tìm email và username trong csdl - 3 Nếu có thì báo có tồn tại
  async CreateUser(req, res) {
    //console.log(req.body); kiem tra http request
    const schema = Joi.object().keys({
      username: Joi.string()
        .min(5)
        .max(10)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(5)
        .required()
    });

    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }
    // Ví dụ: kinh điển về callback function
    // const userEmail = await User.findOne({email: req.body.email});
    // if (userEmail){return res.status(HttpStatus.CONFLICT).json({message:'Email đã tồn tại'})}
    const userEmail = await User.findOne({
      email: Helpers.lowerCase(req.body.email)
    });
    if (userEmail) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: "Email đã tồn tại!" });
    }

    const userName = await User.findOne({
      userName: Helpers.firstUpper(req.body.username)
    });

    if (userName) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: "Username đã tồn tại!" });
    }

    return await bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Lỗi hash password không thành công!" });
      }
      const account = {
        username: Helpers.firstUpper(value.username),
        email: Helpers.lowerCase(value.email),
        password: hash
      };
      User.create(account)
        .then(user => {
          const token = jwt.sign({ data: account }, dbConfig.keysecret, {
            expiresIn: "1h"
          });
          res.cookie("auth", token);
          res
            .status(HttpStatus.CREATED)
            .json({ message: "Thêm thành công!", user, token });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Lỗi server!" });
        });
    });
  },

  async LoginUser(req, res) {
    if (!req.body.username || !req.body.password) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "dữ liệu trống!" });
    }
    await User.findOne({
      username: Helpers.firstUpper(req.body.username)
    }).then(user => {
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Không tìm thấy!" });
      }
      return bcrypt
        .compare(req.body.password, user.password)
        .then(result => {
          if (!result) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: "Không đúng password" });
          }
          const token = jwt.sign({ data: user }, dbConfig.keysecret, {
            expiresIn: "1h"
          });
          res.cookie("auth", token);
          return res
            .status(HttpStatus.OK)
            .json({ message: "Login thành công!", user, token });
        })
        .catch(err => {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Xẩy ra lỗi kiểm tra!" });
        });
    });
  }
};
