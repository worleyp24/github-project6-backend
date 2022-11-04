const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
  updateUserStatus,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, allUsers);
router.route("/login").post(authUser).put(updateUserStatus);
router.put("/update", updateUserStatus);

module.exports = router;
