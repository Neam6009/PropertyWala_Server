const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const userContoller = require("../controllers/users");
const propertyController = require("../controllers/properties");
const blogController = require("../controllers/blogs");
const multer = require("multer");
const propertyModel = require("../models/property_model");
const userModel = require("../models/user_model");
const blogModel = require("../models/blog_model");

router.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const blog_upload = multer({ storage });

router.get(
  "/",
  userContoller.isLoggedIn,
  propertyController.getAllProperties,
  async (req, res) => {
    // res.render("index", { user: req.user, propertyArray: req.properties });
    res.status(200).json("hello");
  }
);

router.get("/login", (req, res) => {
  // res.render("login", { msg: null });
});

router.get("/register", (req, res) => {
  // res.render("register", { msg: null });
});

router.get(
  "/show-properties/:type/:location?",
  userContoller.isLoggedIn,
  async (req, res) => {
    const type = req.params.type;
    let location = "" + req.params.location;
    const query = req.query;
    let properties;
    if (location == "undefined" && Object.keys(query).length == 0) {
      properties = await propertyController.getAllPropertiesByType(
        type,
        location
      );
    } else if (location != "undefined" && Object.keys(query).length == 0) {
      properties = await propertyController.getAllPropertiesByType(
        type,
        location
      );
    } else if (location == "undefined" && Object.keys(query).length != 0) {
      properties = await propertyController.getPropertiesByFilters(
        type,
        location,
        query
      );
    } else if (location != "undefined" && Object.keys(query).length != 0) {
      properties = await propertyController.getPropertiesByFilters(
        type,
        location,
        query
      );
    } else {
      console.log("mole");
      properties = {};
    }
    const filteredProperties = {
      property: { type },
      user: req.user,
      propertyArray: properties,
    };
    // res.render('properties', filteredProperties);
  }
);

router.get(
  "/blogs",
  userContoller.isLoggedIn,
  blogController.getAllBlogs,
  (req, res) => {
    let blogArray = req.blogs;
    // res.render('blogs', { user: req.user, blogArray });
  }
);

router.get("/blog/:id", userContoller.isLoggedIn, async (req, res) => {
  const id = req.params.id;
  let blog = await blogController.getBlogBy_id(id);
  // res.render('blogDetails', { blog: blog, user: req.user });
});

router.get("/my-properties", userContoller.isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const properties = await propertyModel.Property.find({ user_id: userId });
  // res.render('myProperties', { user: req.user, propertyArray: properties });
});

router.get(
  "/property-details/:_id",
  userContoller.isLoggedIn,
  async (req, res) => {
    let property_id = req.params._id;
    property = await propertyController.getPropertyBy_id(property_id);
    let favButton = "Favourite";
    const wishlistPropertiesId = await userModel.User.findById(
      req.user.id
    ).then((user) => user.wishlist);
    if (wishlistPropertiesId.includes(property_id)) {
      favButton = "Remove from Favourite";
    }

    // res.render('propertyDetails', { user: req.user, property, favButton });
  }
);

router.get("/list-property", userContoller.isLoggedIn, (req, res) => {
  // res.render('list-property', { user: req.user });
});

router.post(
  "/list-property",
  userContoller.isLoggedIn,
  upload.array("propertyImages", 3),
  async function (req, res) {
    if (!req.user) {
      // res.redirect('/login');
    } else {
      const newImages = req.files.map((file) => {
        return {
          data: file.buffer,
          contentType: file.mimetype,
        };
      });
      let propertyDetails = req.body;
      await propertyController.insertProperty(
        req,
        res,
        propertyDetails,
        newImages,
        req.user._id
      );
      // res.redirect('/');
    }
  }
);

router.get("/compose-blog", userContoller.isLoggedIn, (req, res) => {
  // res.render('composeBlog', { user: req.user });
});

router.post(
  "/post-blog",
  userContoller.isLoggedIn,
  blog_upload.single("blogImage"),
  async function (req, res) {
    if (!req.user) {
      // res.redirect('/login');
    } else {
      const newBlogImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      let blogDetails = req.body;
      await blogController.insertBlog(
        req,
        res,
        blogDetails,
        newBlogImage,
        req.user
      );

      // res.redirect('/blogs');
      // res.status(200).json({ message: 'done' });
    }
  }
);

router.get("/pricing-plans", userContoller.isLoggedIn, (req, res) => {
  // res.render('pricingPlan', { user: req.user });
});

router.get("/FAQ", userContoller.isLoggedIn, (req, res) => {
  // res.render('FAQ', { user: req.user });
});

router.get("/terms-of-service", userContoller.isLoggedIn, (req, res) => {
  // res.render('termsOfService', { user: req.user });
});

router.get("/trust-and-safety", userContoller.isLoggedIn, (req, res) => {
  // res.render('trustAndSafety', { user: req.user });
});

router.get("/privacy-policy", userContoller.isLoggedIn, (req, res) => {
  // res.render('privacyPolicy', { user: req.user });
});

router.get("/about-us", userContoller.isLoggedIn, (req, res) => {
  // res.render('aboutUs', { user: req.user });
});

router.get("/help", userContoller.isLoggedIn, (req, res) => {
  // res.render('help', { user: req.user });
});

router.get("/profile", userContoller.isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const properties = await propertyModel.Property.find({ user_id: userId });
  const wishlistProperties = await propertyModel.Property.find({
    _id: { $in: req.user.wishlist },
  });

  if (req.user) {
    // res.render('profile', { user: req.user, myProperties: properties, wishlistProperties });
  } else {
    // res.redirect('/login');
  }
});

router.get("/admin-control", userContoller.isLoggedIn, async (req, res) => {
  const users = await userModel.User.find({ _id: { $ne: req.user._id } });

  const properties = await propertyModel.Property.find({});

  const blogs = await blogModel.Blog.find({});
  // res.render('adminControl', { user: req.user, users, properties, blogs });
});

module.exports = router;
