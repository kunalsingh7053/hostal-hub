const router = require("express").Router();
const ctrl = require("../controllers/notice.controller");
const auth = require("../middleware/auth.middleware");
const wardenOnly = require("../middleware/warden.middleware");

router.post("/", auth, wardenOnly, ctrl.createNotice);
router.get("/", auth, ctrl.getNotices);
router.patch("/:id", auth, wardenOnly, ctrl.updateNotice);
router.delete("/:id", auth, wardenOnly, ctrl.deleteNotice);

module.exports = router;