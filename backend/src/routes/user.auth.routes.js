const router = require("express").Router();
const ctrl = require("../controllers/user.auth.controller");

router.post("/register", ctrl.registerStudent);
router.post("/login", ctrl.loginStudent);

module.exports = router;