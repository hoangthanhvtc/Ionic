const jwt = require("jsonwebtoken");
const HttpStatus = require("http-status-codes");
const dbConfig = require("../config/link");

module.exports = {
  VerifyToken: (req, res, next) => {
    if (!req.headers.authorization) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Không có chứng nhận đăng nhập" });
    }
    const token = req.cookies.auth || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Không có thông tin đăng nhập" });
    }
    return jwt.verify(token, dbConfig.keysecret, (err, decoded) => {
      if (err) {
        if (err.expiredAt < new Date()) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message:
              "Tài khoản hết thời gian đăng nhập, vui lòng đăng nhập lại!",
            token: null
          });
        }
        next();
      }
      req.user = decoded.data;
      next();
    });
  }
};
