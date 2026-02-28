const router = require("express").Router();
const ctrl = require("../controllers/menu.controller");
const auth = require("../middleware/auth.middleware");
const wardenOnly = require("../middleware/warden.middleware");

router.post("/", auth, wardenOnly, ctrl.createOrUpdateMenu);
router.get("/", auth, ctrl.getMenu);
router.delete("/day/:day", auth, wardenOnly, ctrl.deleteMenuByDay);
router.delete("/", auth, wardenOnly, ctrl.clearMenu);
router.delete("/:id", auth, wardenOnly, ctrl.deleteMenu);

module.exports = router;