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
const csrf = require("csurf");
let rfs = require("rotating-file-stream");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CHS (Centralized Healthcare System)",
      version: "1.0.0",
      description: "Api documentation for propertyWala",
    },
    servers: [
      {
        url: "http://localhost:3003/",
      },
    ],
  },
  apis: [
    "./server.js",
    "./routes/auth.js",
    "./routes/blogsRoute.js",
    "./routes/pages.js",
    "./routes/propertiesRoute.js",
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(jsonParser);
const corsOptions = {
  origin: [
    "https://property-wala-client-vercel.vercel.app",
    "http://50.19.14.245:5173",
    "http://localhost:5173",
    "*",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
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

app.get("/test", (req, res) => {
  res.status(200).send("api is live");
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(morgan("customTokken", { stream: accessLogStream }));

app.use(express.static(__dirname + "/profileImages"));
app.set("view engine", "ejs");

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/properties", require("./routes/propertiesRoute"));
app.use("/blogs", require("./routes/blogsRoute"));
app.get("/dockerTest", (req, res) => {
  res.send("docker works!!!");
});

/**
 * @swagger
 * /wishlist/{propertyId}:
 *   post:
 *     summary: Add or remove property from user's wishlist
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the property to add or remove from the wishlist
 *     responses:
 *       '200':
 *         description: Wishlist updated successfully
 *       '500':
 *         description: Internal server error
 */
app.post(
  "/wishlist/:propertyId",
  userController.isLoggedIn,
  userController.wishlist
);
/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       '200':
 *         description: All users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error
 */
app.get("/users/all", userController.getAllUsers);

/**
 * @swagger
 * /mail/{mailId}:
 *   post:
 *     summary: Add email to mailing list and send welcome email
 *     tags: [Mail]
 *     parameters:
 *       - in: path
 *         name: mailId
 *         required: true
 *         schema:
 *           type: string
 *         description: Email address to add to the mailing list and send welcome email
 *     responses:
 *       '200':
 *         description: Email added to mailing list and welcome email sent successfully
 *       '500':
 *         description: Internal server error
 */
app.post("/mail/:mailId", mailController.addMail);

/**
 * @swagger
 * /allMail:
 *   post:
 *     summary: Send email to all users
 *     tags: [Mail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 description: Subject of the email
 *               content:
 *                 type: string
 *                 description: Content of the email
 *     responses:
 *       '200':
 *         description: Email sent to all users successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Mail sent successfully
 *       '500':
 *         description: Internal server error
 */
app.post("/allMail", mailController.sendMailAll);

/**
 * @swagger
 * /newsletterMail:
 *   post:
 *     summary: Send newsletter email to all subscribers
 *     tags: [Mail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 description: Subject of the newsletter email
 *               content:
 *                 type: string
 *                 description: Content of the newsletter email
 *     responses:
 *       '200':
 *         description: Newsletter email sent to all subscribers successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Newsletter mail sent successfully
 *       '500':
 *         description: Internal server error
 */
app.post("/newsletterMail", mailController.sendMailNewsletterAll);

/**
 * @swagger
 * /certified/{userId}/{change}:
 *   post:
 *     summary: Update user certification status
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose certification status will be updated
 *       - in: path
 *         name: change
 *         required: true
 *         schema:
 *           type: string
 *         description: Boolean value indicating whether to certify or decertify the user ("true" or "false")
 *     responses:
 *       '200':
 *         description: User certification status updated successfully
 *       '500':
 *         description: Internal server error
 */
app.post("/certified/:userId/:change", userController.certified);

/**
 * @swagger
 * /admin/{userId}/{change}:
 *   post:
 *     summary: Update user admin status
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose admin status will be updated
 *       - in: path
 *         name: change
 *         required: true
 *         schema:
 *           type: string
 *         description: Boolean value indicating whether to grant or revoke admin privileges ("true" or "false")
 *     responses:
 *       '200':
 *         description: User admin status updated successfully
 *       '500':
 *         description: Internal server error
 */
app.post("/admin/:userId/:change", userController.admin);

/**
 * @swagger
 * /admin/deleteUserByAdmin:
 *   post:
 *     summary: Delete user account by admin
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deleteUserId:
 *                 type: string
 *                 description: ID of the user account to be deleted by admin
 *     responses:
 *       '200':
 *         description: User account deleted successfully by admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: user account has been deleted!
 *       '401':
 *         description: Unauthorized or error deleting the user account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: there was an error deleting the account
 *       '500':
 *         description: Internal server error
 */
app.post("/admin/deleteUserByAdmin", userController.deleteUserByAdmin);

/**
 * @swagger
 * /profileImage/{imgId}:
 *   get:
 *     summary: Get user profile image
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: imgId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user profile image
 *     responses:
 *       '200':
 *         description: User profile image retrieved successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       '404':
 *         description: Profile image not found
 *       '500':
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /uploadProfileImage:
 *   post:
 *     summary: Upload user profile image
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file to upload
 *               userId:
 *                 type: string
 *                 description: ID of the user to set the profile image
 *     responses:
 *       '200':
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: File uploaded successfully
 *       '400':
 *         description: No file uploaded or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No file uploaded
 *       '500':
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /error:
 *   get:
 *     summary: Error handler middleware
 *     description: Global error handler middleware for handling server errors
 *     tags: [Error]
 *     responses:
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Something went wrong!
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = { app };
