const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

router.get("/stats", publicController.getHomeStats);
<<<<<<< HEAD
router.post("/contact", publicController.submitContactForm);
=======
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02

module.exports = router;
