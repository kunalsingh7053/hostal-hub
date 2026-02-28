const router = require("express").Router();
const ctrl = require("../controllers/admin.auth.controller");

router.post("/register", ctrl.registerAdmin);
router.post("/login", ctrl.loginAdmin);

module.exports = router;
