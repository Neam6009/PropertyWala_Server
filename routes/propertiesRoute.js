const express = require("express");
const propertyController = require("../controllers/properties");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Property
 *   description: API endpoints for Property
 */

/**
 * @swagger
 * /properties/property-detail/{id}:
 *   get:
 *     summary: Get details of a property
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the property to retrieve details
 *     responses:
 *       '200':
 *         description: Property details retrieved successfully
 *         content:
 *           application/json:
 *       '500':
 *         description: Internal server error
 */
router.get("property-detail/:id", propertyController.propertyDetails);

/**
 * @swagger
 * /properties/all:
 *   get:
 *     summary: Get all properties
 *     tags: [Property]
 *     responses:
 *       '200':
 *         description: All properties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       '400':
 *         description: Bad request or error retrieving properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */
router.get("/all", propertyController.getAllProperties);

/**
 * @swagger
 * /properties/user/{id}:
 *   get:
 *     summary: Get properties by user ID
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve properties
 *     responses:
 *       '200':
 *         description: Properties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       '500':
 *         description: Internal server error
 */
router.get("/user/:id", propertyController.getPropertiesByUser);

router.get(
  "/show-properties/:type/:location?",
  propertyController.filteredProperties
);

/**
 * @swagger
 * /properties/getWishlist/{uid}:
 *   get:
 *     summary: Get wishlist by user ID
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve wishlist
 *     responses:
 *       '200':
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       '500':
 *         description: Internal server error
 */
router.get("/getWishlist/:uid", propertyController.getWishlistByID);

/**
 * @swagger
 * /properties/checkWishlist/{uid}/{pid}:
 *   get:
 *     summary: Check if a property is in the user's wishlist
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the property to check
 *     responses:
 *       '200':
 *         description: Wishlist status checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   description: Indicates whether the property is in the user's wishlist
 *       '500':
 *         description: Internal server error
 */
router.get("/checkWishlist/:uid/:pid", propertyController.checkWishlist);

/**
 * @swagger
 * /properties/removeFromWishlist/{uid}/{pid}:
 *   post:
 *     summary: Remove property from user's wishlist
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the property to remove from wishlist
 *     responses:
 *       '200':
 *         description: Property removed from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Indicates successful removal of the property from the wishlist
 *       '404':
 *         description: User not found or property not found in wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the reason for not finding the user or the property in the wishlist
 *       '500':
 *         description: Internal server error
 */
router.post(
  "/removeFromWishlist/:uid/:pid",
  propertyController.removePropertyFromWishlist
);

/**
 * @swagger
 * /properties/addToWishlist/{uid}/{pid}:
 *   post:
 *     summary: Add property to user's wishlist
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the property to add to wishlist
 *     responses:
 *       '200':
 *         description: Property added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Indicates successful addition of the property to the wishlist
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user was not found
 *       '500':
 *         description: Internal server error
 */
router.post(
  "/addToWishlist/:uid/:pid",
  propertyController.addPropertyToWishlist
);

/**
 * @swagger
 * /properties/remove/{id}:
 *   post:
 *     summary: Remove property by ID (Admin)
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the property to remove
 *     responses:
 *       '200':
 *         description: Property removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: Indicates successful removal of the property
 *       '500':
 *         description: Internal server error
 */
router.post("/remove/:id", propertyController.removeProperty); //this is used by the admin

/**
 * @swagger
 * /properties/removeProperty:
 *   post:
 *     summary: Delete property by user (User)
 *     tags: [Property]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               userId:
 *                 type: string
 *               propertyId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Property deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   description: Indicates successful deletion of the property
 *       '400':
 *         description: Bad request or wrong password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating wrong password
 *       '500':
 *         description: Internal server error
 */
router.post("/removeProperty", propertyController.deleteProperty); // this is used by the user

/**
 * @swagger
 * /properties/listProperty:
 *   post:
 *     summary: List a property
 *     tags: [Property]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property:
 *                 type: object
 *                 properties:
 *                   propertyName:
 *                     type: string
 *                   propertyPrice:
 *                     type: number
 *                   propertyCity:
 *                     type: string
 *                   propertyLocality:
 *                     type: string
 *                   bedsNum:
 *                     type: number
 *                   bathsNum:
 *                     type: number
 *                   propertyArea:
 *                     type: number
 *                   propertyPurpose:
 *                     type: string
 *                   propertyDescription:
 *                     type: string
 *                   propertyParking:
 *                     type: number
 *                   propertyType:
 *                     type: string
 *                   yearBuilt:
 *                     type: number
 *                   lotSize:
 *                     type: number
 *                   listerName:
 *                     type: string
 *                   listerDescription:
 *                     type: string
 *                   listerRelation:
 *                     type: string
 *                   listerMobileNumber:
 *                     type: string
 *                   listerEmail:
 *                     type: string
 *               user_id:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Property listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: Indicates successful listing of the property
 *       '500':
 *         description: Internal server error
 */
router.post("/listProperty", propertyController.insertProperty);
module.exports = router;
