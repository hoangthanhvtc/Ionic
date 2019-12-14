// Nạp Dependencies
//var createError = require("http-errors");
var express = require("express");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var cors = require("cors");

//var logger = require("morgan");
const app = express();
const dbConnect = require("./config/link");

const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
//Nạp middleware
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET", "POST", "DELETE", "PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
mongoose.Promise = global.Promise;
app.use(express.json({ limited: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
//app.use(logger("dev"));

//Nội dung server
//Connect mongodb
mongoose.connect(dbConnect.url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

//Nạp io socket
require("./socket/streams")(io);
//Nạp routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
app.use("/api/chatapp", authRoutes);
app.use("/api/chatapp", postRoutes);

// ------> catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

// --> error handler
//app.use(function(err, req, res, next) {
// --> set locals, only providing error in development
//res.locals.message = err.message;
//res.locals.error = req.app.get("env") === "development" ? err : {};

// --> render the error page
//res.status(err.status || 500);
//res.render("error");
//});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Running at Port: ", port);
});
