const express = require("express");
const router = express.Router();
const { handleUserLogin } = require("../controllers/auth");

// Point the login route to the controller function
router.post("/login", handleUserLogin);

module.exports = router;