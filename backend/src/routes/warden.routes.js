const router = require("express").Router();
const ctrl = require("../controllers/warden.controller");
const auth = require("../middleware/auth.middleware");
const wardenOnly = require("../middleware/warden.middleware");

router.get("/me", auth, wardenOnly, ctrl.getWardenProfile);
router.put("/me", auth, wardenOnly, ctrl.updateWarden);

module.exports = router;