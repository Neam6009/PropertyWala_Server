const express = require("express");
const doenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userController = require("./controllers/users");
const mailController = require("./controllers/mail");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const csrf = require('csurf');
let rfs = require("rotating-file-stream");


const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const app = express();
const csrfProtection = csrf({ cookie: true });

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(jsonParser);
app.use(csrfProtection);

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

doenv.config({
  path: "./.env",
});

let accessLogStream = rfs.createStream("propertyWala.log", {
  interval: "1h",
  path: path.join(__dirname, "log"),
});

morgan.token(
  "customTokken",
  "A new :method requires for :url was received. It took :total-time[2] milliseconds to be resolved"
);

app.use(morgan("customTokken", { stream: accessLogStream }));

app.use(express.static(__dirname + "/profileImages"));
app.set("view engine", "ejs");

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/properties", require("./routes/propertiesRoute"));
app.use("/blogs", require("./routes/blogsRoute"));
app.post(
  "/wishlist/:propertyId",
  userController.isLoggedIn,
  userController.wishlist
);

app.get('/csrf-token', (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

app.get("/users/all", userController.getAllUsers);
app.post("/mail/:mailId", mailController.addMail);
app.post("/allMail", mailController.sendMailAll);
app.post("/newsletterMail", mailController.sendMailNewsletterAll);

app.post("/certified/:userId/:change", userController.certified);
app.post("/admin/:userId/:change", userController.admin);
app.post("/admin/deleteUserByAdmin", userController.deleteUserByAdmin);


app.get("/profileImage/:imgId", (req, res) => {
  const imgId = req.params.imgId;
  const parentDirectory = path.resolve(__dirname, "..");
  const root = parentDirectory.replace(/\\/g, "/");
  res.status(200).sendFile(`${root}/profileImages/${imgId}`);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directory = "profileImages";
    fs.mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        return cb(err, null);
      }
      cb(null, directory);
    });
  },
  filename: async (req, file, cb) => {
    const newFileName = new Date().getTime().toString(16) + file.originalname;
    req.newFileName = newFileName;

    await cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

app.post(
  "/uploadProfileImage",
  upload.single("profileImage"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    userController.setProfileImage(req.newFileName, req.body.userId);
    return res.status(200).json({ success: "File uploaded successfully" });
  }
);

const logRoute = (req, res, next) => {
  console.log(`Accessed route: ${req.method} ${req.url}`);
  next();
};

app.use(logRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(3003, () => {
  console.log("Listening at port no 3003 ...");
});
