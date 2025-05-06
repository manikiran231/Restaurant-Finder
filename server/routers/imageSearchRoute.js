const express = require("express");
const multer = require("multer");
const { detectCuisine } = require("../controllers/imageSearchController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/detect-cuisine", upload.single("image"), detectCuisine);

module.exports = router;