const express = require("express");
const router = express.Router();
const {
  accessConversation,
  fetchConversation,
} = require("../controllers/conversationControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, accessConversation);
router.route("/").get(protect, fetchConversation);

module.exports = router;
