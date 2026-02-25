const router = require("express").Router();
const ctrl = require("../controllers/warden.auth.controller");

router.post("/login", ctrl.loginWarden);
router.post("/register", ctrl.registerWarden);

module.exports = router;